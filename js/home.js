const formulario = document.getElementById("formbusqueda");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const origen = document.getElementById("origen").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const fechaIda = document.getElementById("fechaIda").value;
    const fechaVuelta = document.getElementById("fechaVuelta").value;
    const personas = document.getElementById("personas").value;

    if(
        origen === "" ||
        destino === "" ||
        fechaIda === "" ||
        fechaVuelta === ""
    ){
        alert("Complete todos los campos.");
        return;
    }

    if(origen.toLowerCase() === destino.toLowerCase()){
        alert("El origen y destino no pueden ser iguales.");
        return;
    }

    if(fechaVuelta < fechaIda){
        alert("La fecha de vuelta debe ser posterior a la fecha de ida.");
        return;
    }

    localStorage.setItem("origen", origen);
    localStorage.setItem("destino", destino);
    localStorage.setItem("fechaIda", fechaIda);
    localStorage.setItem("fechaVuelta", fechaVuelta);
    localStorage.setItem("personas", personas);

    window.location.href = "pages/resultados.html";
});


// OFERTAS DEL HOME
const ofertasHome = document.querySelectorAll(".caja-oferta");

ofertasHome.forEach(function (oferta) {

    oferta.addEventListener("click", function () {

        localStorage.removeItem("origen");
        localStorage.removeItem("fechaIda");
        localStorage.removeItem("fechaVuelta");
        localStorage.removeItem("personas");

        localStorage.setItem(
            "destino",
            this.dataset.destino
        );

    });

});