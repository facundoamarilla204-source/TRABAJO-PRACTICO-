document.addEventListener("DOMContentLoaded", function () {

    const botonesOferta = document.querySelectorAll(".btn-oferta");

    botonesOferta.forEach(function (boton) {

        boton.addEventListener("click", function (e) {
            
            e.preventDefault(); 

            
            const destinoOferta = this.dataset.destino;
            const idaOferta = this.dataset.fechaIda;
            const vueltaOferta = this.dataset.fechaVuelta;

            localStorage.setItem("origen", "Buenos Aires"); 
            localStorage.setItem("destino", destinoOferta);
            localStorage.setItem("fechaIda", idaOferta);
            localStorage.setItem("fechaVuelta", vueltaOferta);
            localStorage.setItem("personas", "1"); 

            console.log("Oferta seleccionada:", destinoOferta, "del", idaOferta, "al", vueltaOferta);

            window.location.href = "./resultados.html";
        });

    });

});