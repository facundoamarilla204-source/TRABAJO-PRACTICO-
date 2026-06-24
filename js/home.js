const formulario = document.getElementById("formbusqueda");

formulario.addEventListener("submit", function(event){
    event.preventDefault();

    const origen = document.getElementById("origen").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const fechaIda = document.getElementById("fechaIda").value;
    const fechaVuelta = document.getElementById("fechaVuelta").value;
    
    const selectPersonas = document.getElementById("personas");
    const personas = selectPersonas ? selectPersonas.value : 1;

    if(origen === "" || destino === "" || fechaIda === "" || fechaVuelta === ""){
        alert("Complete todos los campos.");
        return;
    }

    if(origen.toLowerCase() === destino.toLowerCase()){
        alert("El origen y destino no pueden ser iguales.");
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaIdaObj = new Date(fechaIda + 'T00:00:00');
    const fechaVueltaObj = new Date(fechaVuelta + 'T00:00:00');

    if (fechaIdaObj <= hoy) {
        alert("La fecha de ida debe ser a partir de mañana.");
        return;
    }

    if (fechaVueltaObj <= fechaIdaObj) {
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


const modal = document.querySelector(".modal_personas");
const btnContinuar = document.querySelector(".btn_modal_continuar");
const selectPersonasModal = document.querySelector("#cantidad_personas");

const ofertasHome = document.querySelectorAll(".caja-oferta");

ofertasHome.forEach(function (oferta) {

    oferta.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.setItem("origen", "Buenos Aires");
        localStorage.setItem("destino", this.dataset.destino);
        localStorage.setItem("fechaIda", this.dataset.fechaIda);
        localStorage.setItem("fechaVuelta", this.dataset.fechaVuelta);

        modal.style.display = "flex";

    });

});

btnContinuar.addEventListener("click", function () {

    const cantidadPersonas = selectPersonasModal.value;

    localStorage.setItem("personas", cantidadPersonas);

    window.location.href = "pages/resultados.html";

});

modal.addEventListener("click", function (e) {

    if (e.target === modal) {
        modal.style.display = "none";
    }

});