document.addEventListener("DOMContentLoaded", function () {

    const botonesOferta = document.querySelectorAll(".btn-oferta");

    botonesOferta.forEach(function (boton) {

        boton.addEventListener("click", function () {

            localStorage.setItem(
                "destino",
                this.dataset.destino
            );

            console.log(
                "Destino guardado:",
                this.dataset.destino
            );

        });

    });

});