document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // DATOS BUSQUEDA
    // =========================
    const destinoBuscado = localStorage.getItem("destino");
    const fechaIdaBuscada = localStorage.getItem("fechaIda");
    const fechaVueltaBuscada = localStorage.getItem("fechaVuelta");

    const idaBuscada = fechaIdaBuscada ? new Date(fechaIdaBuscada) : null;
    const vueltaBuscada = fechaVueltaBuscada ? new Date(fechaVueltaBuscada) : null;

    console.log("Destino:", destinoBuscado);
    console.log("Fecha ida:", idaBuscada);
    console.log("Fecha vuelta:", vueltaBuscada);

    // =========================
    // EQUIPAJE
    // =========================
    let equipajeSeleccionado = 0;

    const equipajes = document.querySelectorAll(".equipaje-card");

    equipajes.forEach(function (equipaje) {
        equipaje.addEventListener("click", function () {

            equipajes.forEach(e => e.classList.remove("seleccionado"));
            this.classList.add("seleccionado");

            const texto = this.querySelector("span").textContent;

            if (texto.includes("45")) {
                equipajeSeleccionado = 45;
            } else if (texto.includes("85")) {
                equipajeSeleccionado = 85;
            } else {
                equipajeSeleccionado = 0;
            }

            console.log("Equipaje:", equipajeSeleccionado);
        });
    });

    // =========================
    // BOTONES SELECT
    // =========================
    const botones = document.querySelectorAll(".btn-select");

    botones.forEach(function (btn) {

        btn.addEventListener("click", function () {

            const totalbase = Number(this.dataset.total);

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
                equipaje: equipajeSeleccionado,

                asientos: this.dataset.asientos,
                impuestos: this.dataset.impuestos,

                total: totalbase + equipajeSeleccionado,

                pago: this.dataset.pago
            };

            localStorage.setItem(
                "vueloSeleccionado",
                JSON.stringify(vuelo)
            );
        });
    });

    // =========================
    // VUELOS
    // =========================
    const vuelos = document.querySelectorAll(".vuelo-card");

    vuelos.forEach(function (vuelo, index) {
        vuelo.dataset.ordenOriginal = index;
    });

    // =========================
    // FILTRO PRECIO
    // =========================
    const rangePrecio = document.getElementById("filtroPrecio");
    const valorPrecio = document.getElementById("valorPrecio");

    // =========================
    // AEROLINEAS
    // =========================
    const filtroAerolineas = document.querySelectorAll(".filtroAerolinea");

    filtroAerolineas.forEach(cb => {
        cb.addEventListener("change", aplicarFiltros);
    });

    if (rangePrecio) {
        rangePrecio.addEventListener("input", function () {
            valorPrecio.textContent = this.value;
            aplicarFiltros();
        });
    }

    // =========================
    // ORDENAR
    // =========================
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

    // =========================
    // FILTROS PRINCIPALES
    // =========================
    function aplicarFiltros() {

        const precioMax = Number(rangePrecio?.value || 999999);

        const aerolineasSeleccionadas = Array.from(
            document.querySelectorAll(".filtroAerolinea:checked")
        ).map(el => el.value.toLowerCase());

        let vuelosEncontrados = 0;

        vuelos.forEach(function (vuelo) {

            // =========================
            // DESTINO
            // =========================
            let coincideDestino = true;

            if (destinoBuscado) {
                const ciudadDestino =
                    vuelo.querySelectorAll(".ciudad")[1].textContent.trim();

                coincideDestino =
                    ciudadDestino.toLowerCase() === destinoBuscado.toLowerCase();
            }

            // =========================
            // PRECIO
            // =========================
            const coincidePrecio =
                Number(vuelo.dataset.precio) <= precioMax;

            // =========================
            // AEROLINEA
            // =========================
            const aerolineasDelVuelo = Array.from(
                vuelo.querySelectorAll(".aerolinea-option span")
            ).map(el => el.textContent.trim().toLowerCase());

            let coincideAerolinea = true;

            if (aerolineasSeleccionadas.length > 0) {
                coincideAerolinea = aerolineasSeleccionadas.some(sel =>
                    aerolineasDelVuelo.includes(sel)
                );
            }

            // =========================
            // FECHAS (CORREGIDO)
            // =========================
            let coincideFecha = true;

            const fechaIdaVuelo = vuelo.dataset.fechaIda;
            const fechaVueltaVuelo = vuelo.dataset.fechaVuelta;

            if (fechaIdaBuscada && fechaVueltaBuscada) {
                coincideFecha =
                    fechaIdaVuelo === fechaIdaBuscada &&
                    fechaVueltaVuelo === fechaVueltaBuscada;
            }

            // =========================
            // MOSTRAR / OCULTAR
            // =========================
            if (
                coincideDestino &&
                coincidePrecio &&
                coincideAerolinea &&
                coincideFecha
            ) {
                vuelo.style.display = "block";
                vuelosEncontrados++;
            } else {
                vuelo.style.display = "none";
            }
        });

        document.getElementById("cantidadVuelos").textContent = vuelosEncontrados;
    }

    // primera carga
    aplicarFiltros();
});