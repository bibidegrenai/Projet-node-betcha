const express = require('express')
const app = express()
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const crypt = require('bcrypt')
const session = require('express-session');
const mongoSession = require('connect-mongodb-session')(session)

const BDD = "mongodb://localhost:27017/betchadb"

mongoose.connect(BDD, { useNewUrlParser: true }).then(() =>
    console.log("Connexion db ok")).catch((error) =>
    console.log(error.message))

const Users = mongoose.Schema({
    pseudo: {
        type: String,
        require: [true, 'pseudo required']
    },
    mdp: {
        type: String,
        required: [true, 'mdp required']
    }
})
const store = new mongoSession({
    uri: BDD,
    collection: 'sessions'
})

const Session = new mongoose.Schema({
    session: {
        userid: String,
        isOnline:Boolean
    }
})
const Parties = mongoose.Schema({
    idGame : Number,
    name:String,
    lot : {type:Number,default:6},
    nomp1 : String,
    tokenp1:{type:Number,default:100},
    nomp2:String,
    tokenp2:{type:Number,default:100},
    deplacement:Array,
    betHistory:[{
        betP1:Array,
        betP2:Array,

    }]


})


const sessionModel = mongoose.model("sessions",Session)
const newUser = mongoose.model("users", Users)
const newGame = mongoose.model("game",Parties)


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static("./public"))

const TTL = 43200000
app.use(session({
    secret:"chutchutcestsecretzeubi",
    saveUninitialized: false,
    cookie: { maxAge: TTL },
    resave: false,
    store:store
}))

app.post("/user/login", (req, res) => {
    newUser.findOne({pseudo:req.body.pseudo},(err,userFind)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(userFind===null||!userFind)
            {
                res.redirect('/')
                console.log("Utilisateur inexistant");
            }
            else
            {
                crypt.compare(req.body.mdp,userFind.mdp,function(err,result){
                    
                    if(result){
                        req.session.userid = req.body.pseudo
                        req.session.isOnline = true
                        res.redirect('/accueil.html')
                        console.log("CONNECT");
                    }
                    else{
                        res.redirect('/')
                        console.log("FAIL");
                        console.log(req.body.mdp);
                        console.log(userFind.password);
                    }
                })
            }
        }
    })
})


app.post("/users/signin", async(req, res) => {
    newUser.findOne({pseudo:req.body.pseudo},(err,userFind)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            if(userFind===null||!userFind)
            {
                crypt.genSalt(10, function(err, salt) {
                    crypt.hash(req.body.mdp, salt)
                        .then((hash) => {
                            createUser(req.body.pseudo, hash);
                        })
                    })
                    req.session.userid = req.body.pseudo
                    req.session.isOnline = true
                    res.redirect("/accueil.html")
            }
            else{
                console.log("Utilisateur trouvé");
            }
        }
    })
 })

app.post("/user/deco", (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    });
})



app.get('/session', (req, res) => {

    res.json(req.session.userid)

})
app.get('/listUser',(req,res)=>{
    newUser.find({},(err,listuser)=>{
        if(err){
            console.log(err);
        }
        else{
            res.json(listuser)
        }
    })

})
app.post('/games/ajouter',(req,res)=>{
    req.body.lot = 6
    req.body.nomp1 =  req.session.userid
    req.body.tokenp1 = 100
    req.body.nomp2 = req.body.adv
    req.body.tokenp2 = 100
    let gameCreate = new newGame(req.body)
    gameCreate.save(function(err){
        if(err){throw err}

    })
    res.redirect('/accueil.html')
})

app.get('/games',(req,res)=>{
    newGame.find({$or: [{nomp1:req.session.userid},{nomp2:req.session.userid}]}, '-_id nomp1 nomp2',function(err,gameList){
        res.json(gameList)
    })
})
app.get('/currentGameData/:id',(req,res)=>{
    newGame.find({},function(err,gameList){
        res.json(gameList[req.params.id])
    })
})

app.post('/games/rejoindre/:id',(req, res) =>{
    let id = req.params.id
        res.redirect('/jeu.html?id='+id)
    
})

app.post('/delete/:id', async function(req,res){
    let id = req.params.id
    await newGame.findOneAndDelete(({'idgame' : req.params.id}))

    res.redirect('/accueil.html')
})


//---------------Serveur à l'écoute port 3000----------------------------------
app.listen(3000)



//------------------------FONCTIONS----------------------------------
async function createUser(name, pass) {
    const user = new newUser({
        pseudo: name,
        mdp: pass,
        isPublished: true
    });
    const result = await user.save();
    console.log(result);
}
function generateId(){
    let genId = Math.floor(Math.random()*1000)
    return genId
}
