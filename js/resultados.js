document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".btn-select");

    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", function () {
            const vuelo = {
                aerolinea: this.dataset.aerolinea,
                logo: this.dataset.logo,
                origen: this.dataset.origen,
                ciudadOrigen: this.dataset.ciudadOrigen,
                destino: this.dataset.destino,
                ciudadDestino: this.dataset.ciudadDestino,
                salida: this.dataset.salida,
                llegada: this.dataset.llegada,
                duracion: this.dataset.duracion,
                salidaVuelta: this.dataset.salidaVuelta,
                llegadaVuelta: this.dataset.llegadaVuelta,
                duracionVuelta: this.dataset.duracionVuelta,
                moneda: this.dataset.moneda,
                precioBase: this.dataset.precioBase,
                equipaje: this.dataset.equipaje,
                asientos: this.dataset.asientos,
                impuestos: this.dataset.impuestos,
                total: this.dataset.total,
                pago: this.dataset.pago
            };

            localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));
        });
    }
});