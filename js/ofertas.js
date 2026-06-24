document.addEventListener("DOMContentLoaded", function () {

    const botonesOferta = document.querySelectorAll(".btn-oferta");
    const modal = document.querySelector(".modal_personas");
    const btnContinuar = document.querySelector(".btn_modal_continuar");
    const selectPersonas = document.querySelector("#cantidad_personas");

    botonesOferta.forEach(function (boton) {

        botonesOferta.forEach(function (boton) {
        boton.addEventListener("click", function (e) {
            e.preventDefault();

            localStorage.setItem("origen", "Buenos Aires");
            localStorage.setItem("destino", this.dataset.destino);
            localStorage.setItem("fechaIda", this.dataset.fechaIda);
            localStorage.setItem("fechaVuelta", this.dataset.fechaVuelta);
            
            // LO GUARDAMOS ACÁ: Al momento de hacer el clic en la oferta
            localStorage.setItem("descuentoOferta", this.dataset.descuento);

            modal.style.display = "flex";
        });
    });

    btnContinuar.addEventListener("click", function () {
        const cantidadPersonas = selectPersonas.value;

        localStorage.setItem("personas", cantidadPersonas);
        // BORRAMOS la línea del descuento de acá también.

        window.location.href = "./resultados.html";
    });
});

});