
document.addEventListener("DOMContentLoaded", async () => {
    
    let url = new URL(window.location.href)
    let id = url.searchParams.get("id")
    fetch('/currentGameData/'+id).then((games) => {
        return games.json()
    }).then((game) => {

        let jeton1 = document.querySelector(".jetonp1")
        let pseudo1 = document.querySelector(".pseudo1")
        let jeton2 = document.querySelector(".jetonp2")
        let pseudo2 = document.querySelector(".pseudo2")

        pseudo1.innerHTML = game.nomp1
        pseudo2.innerHTML = game.nomp2
        jeton1.innerHTML = game.tokenp1 + " jetons"
        jeton2.innerHTML = game.tokenp2 + " jetons"

    })
})