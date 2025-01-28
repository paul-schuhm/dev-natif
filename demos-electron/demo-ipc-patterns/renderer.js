
//Mode 1 : Renderer vers main (unidirectionnel)
const btn = document.getElementById('change_title');
const inputTitle = document.getElementById('title');

btn.addEventListener('click', (event) => {
    console.log('Change title to '+ inputTitle.value);
    //Envoie un message à main
    window.api.setTitle(inputTitle.value);
});

// Mode 2 : Renderer vers main bidirectionnel
const btnAsk = document.getElementById('ask');
btnAsk.addEventListener('click', async (event) => {
    const value = await window.api.askValue();
    document.getElementById('result_from_main').innerText = value;
})

//Mode 3 : Main vers renderer
//Appel à la fonction exposée dans l'API pour enregistrer ma callback et réagir au message de main
window.api.onChangeColorToRed(() => {
    console.log('main me demande de changer de couleur');
    document.getElementById('html').style.color = "red";
});

