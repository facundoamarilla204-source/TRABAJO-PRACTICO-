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


const ofertasHome = document.querySelectorAll(".caja-oferta");

ofertasHome.forEach(function (oferta) {
    oferta.addEventListener("click", function (e) {
        e.preventDefault();

       
        const destinoOferta = this.dataset.destino;
        const idaOferta = this.dataset.fechaIda;
        const vueltaOferta = this.dataset.fechaVuelta;

        
        localStorage.setItem("origen", "Buenos Aires");
        localStorage.setItem("destino", destinoOferta);
        localStorage.setItem("fechaIda", idaOferta);
        localStorage.setItem("fechaVuelta", vueltaOferta);
        localStorage.setItem("personas", "1"); 

        
        window.location.href = "pages/resultados.html";
    });
});