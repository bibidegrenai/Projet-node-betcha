let session

document.addEventListener("DOMContentLoaded", async () => {

    let tableau = document.querySelector(".table")
    let buttons = document.querySelector("button")
    let menu = document.querySelector(".form-select")

    fetch("/session").then((userdata) => {
        return userdata.json()
    }).then(function (resuser) {
        session = resuser
    })

    fetch('/listUser').then((users) => {
        return users.json()
    }).then((opponent) => {
        for (const [i, joueur] of opponent.entries()) {

            choix = document.createElement("option")
            choix.value = joueur.pseudo
            choix.innerHTML = joueur.pseudo
            menu.appendChild(choix)
        }
    })

    fetch('/games').then((data) => {
        return data.json()
    }).then((games) => {
        for (const [i, game] of games.entries()) {

            ligne = document.createElement("tr")

            tableau.appendChild(ligne)

            for ([cle, val] of Object.entries(game)) {
                colonne = document.createElement("td")
                colonne.scope = "col"
                colonne.textContent = (val)
                ligne.appendChild(colonne)
            }

            clnstatut = document.createElement("td")
            ligne.appendChild(clnstatut)
            clnstatut.innerHTML = "En cours"

            clnlien = document.createElement("td")
            ligne.appendChild(clnlien)
            clnlien.innerHTML = "localhost:3000/jeux.html?id=" + i

            clnrejoindre = document.createElement("td")
            ligne.appendChild(clnrejoindre)
            forms = document.createElement("form")
            forms.method = "post"
            forms.action = "/games/rejoindre/" + i
            clnrejoindre.appendChild(forms)
            btnrejoindre = document.createElement("button")
            btnrejoindre.type = "submit"
            btnrejoindre.className = "btn btn-primary"
            btnrejoindre.innerHTML = "Rejoindre"
            forms.appendChild(btnrejoindre)



            clnsupprimer = document.createElement("td")
            ligne.appendChild(clnsupprimer)
            forms = document.createElement("form")
            forms.method = "post"
            forms.action = "/delete/" + i
            clnsupprimer.appendChild(forms)
            btnsupprimer = document.createElement("button")
            btnsupprimer.type = "submit"
            btnsupprimer.className = "btn btn-danger"
            btnsupprimer.innerHTML = "Supprimer"
            forms.appendChild(btnsupprimer)
        }


    })



})