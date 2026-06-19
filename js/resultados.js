document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // DATOS BUSQUEDA
    // =========================
    const destinoBuscado = localStorage.getItem("destino");
    const fechaIdaBuscada = localStorage.getItem("fechaIda");
    const fechaVueltaBuscada = localStorage.getItem("fechaVuelta");

    let equipajeSeleccionado = 0;

    // =========================
    // EQUIPAJE
    // =========================
    const equipajes = document.querySelectorAll(".equipaje-card");

    equipajes.forEach((equipaje) => {

        equipaje.addEventListener("click", function () {

            equipajes.forEach(e => e.classList.remove("seleccionado"));
            this.classList.add("seleccionado");

            const valor = Number(this.dataset.equipaje);

            equipajeSeleccionado = isNaN(valor) ? 0 : valor;
        });
    });

    // =========================
    // BOTÓN SELECCIONAR VUELO
    // =========================
    const botones = document.querySelectorAll(".btn-select");

    botones.forEach(function (btn) {

        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const personas = Number(localStorage.getItem("personas")) || 1;

            const vuelo = {
                aerolinea: btn.dataset.aerolinea,
                logo: btn.dataset.logo,

                origen: btn.dataset.origen,
                ciudadOrigen: btn.dataset.ciudadOrigen,
                destino: btn.dataset.destino,
                ciudadDestino: btn.dataset.ciudadDestino,

                salida: btn.dataset.salida,
                llegada: btn.dataset.llegada,
                duracion: btn.dataset.duracion,

                salidaVuelta: btn.dataset.salidaVuelta,
                llegadaVuelta: btn.dataset.llegadaVuelta,
                duracionVuelta: btn.dataset.duracionVuelta,

                moneda: btn.dataset.moneda || "USD",

                // =========================
                // IMPORTANTÍSIMO: UNITARIOS
                // =========================
                precioBaseUnitario: Number(btn.dataset.precioBase),
                impuestosUnitario: Number(btn.dataset.impuestos),
                asientoUnitario: Number(btn.dataset.asientos),

                equipajeUnitario: equipajeSeleccionado,

                personas: personas,

                pago: btn.dataset.pago,

                fechaIda: fechaIdaBuscada,
                fechaVuelta: fechaVueltaBuscada
            };

            localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

            // limpiar asiento anterior
            localStorage.removeItem("asientosSeleccionados");

            window.location.href = "./disponibilidad.html";
        });
    });

    // =========================
    // FILTROS + ORDEN
    // =========================
    const vuelos = document.querySelectorAll(".vuelo-card");

    vuelos.forEach((v, i) => v.dataset.ordenOriginal = i);

    const rangePrecio = document.getElementById("filtroPrecio");
    const valorPrecio = document.getElementById("valorPrecio");
    const filtroAerolineas = document.querySelectorAll(".filtroAerolinea");

    filtroAerolineas.forEach(cb => cb.addEventListener("change", aplicarFiltros));

    if (rangePrecio) {
        rangePrecio.addEventListener("input", function () {
            valorPrecio.textContent = this.value;
            aplicarFiltros();
        });
    }

    const selectOrdenar = document.querySelector(".select_ordenar");

    if (selectOrdenar) {
        selectOrdenar.addEventListener("change", function () {

            const contenedor = document.querySelector(".lista-vuelos");
            const vuelosArray = Array.from(document.querySelectorAll(".vuelo-card"));

            if (this.value === "Precio menor") {
                vuelosArray.sort((a, b) =>
                    Number(a.dataset.precio) - Number(b.dataset.precio)
                );
            } else if (this.value === "Precio mayor") {
                vuelosArray.sort((a, b) =>
                    Number(b.dataset.precio) - Number(a.dataset.precio)
                );
            } else {
                vuelosArray.sort((a, b) =>
                    Number(a.dataset.ordenOriginal) - Number(b.dataset.ordenOriginal)
                );
            }

            vuelosArray.forEach(v => contenedor.appendChild(v));
        });
    }

    function aplicarFiltros() {

        const precioMax = Number(rangePrecio?.value || 999999);

        const aerolineasSeleccionadas = Array.from(
            document.querySelectorAll(".filtroAerolinea:checked")
        ).map(el => el.value.toLowerCase());

        let count = 0;

        vuelos.forEach(vuelo => {

            const precio = Number(vuelo.dataset.precio);

            const coincidePrecio = precio <= precioMax;

            const aerolineas = Array.from(
                vuelo.querySelectorAll(".aerolinea-option span")
            ).map(e => e.textContent.toLowerCase());

            const coincideAerolinea =
                aerolineasSeleccionadas.length === 0 ||
                aerolineasSeleccionadas.some(a => aerolineas.includes(a));

            let coincideDestino = true;

            if (destinoBuscado) {
                const ciudad = vuelo.querySelectorAll(".ciudad")[1].textContent;
                coincideDestino = ciudad.toLowerCase() === destinoBuscado.toLowerCase();
            }

            const fechaIda = vuelo.dataset.fechaIda;
            const fechaVuelta = vuelo.dataset.fechaVuelta;

            let coincideFecha = true;

            if (fechaIdaBuscada && fechaVueltaBuscada) {
                coincideFecha =
                    fechaIda === fechaIdaBuscada &&
                    fechaVuelta === fechaVueltaBuscada;
            }

            if (coincidePrecio && coincideAerolinea && coincideDestino && coincideFecha) {
                vuelo.style.display = "block";
                count++;
            } else {
                vuelo.style.display = "none";
            }
        });

        document.getElementById("cantidadVuelos").textContent = count;
    }

    aplicarFiltros();
});