document.addEventListener("DOMContentLoaded", function () {

    // FILTRO SEGÚN BÚSQUEDA DEL HOME
    const destinoBuscado = localStorage.getItem("destino");

    console.log("Destino buscado:", destinoBuscado);

    

    // BOTONES SELECCIONAR
    const botones = document.querySelectorAll(".btn-select");

    for (let i = 0; i < botones.length; i++) {

        botones[i].addEventListener("click", function () {
            const equipaje = Number(equipajeSeleccionado);
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
                equipaje: equipaje,
                asientos: this.dataset.asientos,
                impuestos: this.dataset.impuestos,
                total: totalbase + equipaje,
                pago: this.dataset.pago
            };

            localStorage.setItem(
                "vueloSeleccionado",
                JSON.stringify(vuelo)
            );

        });

    }



    // VUELOS
    const vuelos = document.querySelectorAll(".vuelo-card");

    // GUARDAR ORDEN ORIGINAL
    vuelos.forEach(function (vuelo, index) {
        vuelo.dataset.ordenOriginal = index;
    });

    // FILTRO DE PRECIO
    const rangePrecio = document.getElementById("filtroPrecio");
    const valorPrecio = document.getElementById("valorPrecio");

    aplicarFiltros();

    if (rangePrecio) {

        rangePrecio.addEventListener("input", function () {

        

         valorPrecio.textContent = this.value;
        aplicarFiltros();

        });

    }

    // FILTRO DE AEROLÍNEAS
    const filtroAerolineas =
        document.querySelectorAll(".filtroAerolinea");

    filtroAerolineas.forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

          aplicarFiltros();

        });

    });

    // EQUIPAJE
    let equipajeSeleccionado = 0;
    const equipajes = document.querySelectorAll(".equipaje-card");

    equipajes.forEach(function (equipaje) {
        equipaje.addEventListener("click", function () {

            equipajes.forEach(function (e) {
                e.classList.remove("seleccionado");
            });

            this.classList.add("seleccionado");

            const texto = this.querySelector("span").textContent;

            if (texto.includes("45")) {
                equipajeSeleccionado = 45;
            } else if (texto.includes("85")) {
                equipajeSeleccionado = 85;
            } else {
                equipajeSeleccionado = 0;
            }

            console.log("Equipaje seleccionado:", equipajeSeleccionado);
        });
    });

    // ORDENAR VUELOS
    const selectOrdenar =
        document.querySelector(".select_ordenar");

    if (selectOrdenar) {

        selectOrdenar.addEventListener(
            "change",
            function () {

                const contenedor =
                    document.querySelector(".lista-vuelos");

                const vuelosArray = Array.from(
                    document.querySelectorAll(".vuelo-card")
                );

                if (this.value === "Precio menor") {

                    vuelosArray.sort(function (a, b) {

                        return (
                            Number(a.dataset.precio) -
                            Number(b.dataset.precio)
                        );

                    });

                } else if (
                    this.value === "Precio mayor"
                ) {

                    vuelosArray.sort(function (a, b) {

                        return (
                            Number(b.dataset.precio) -
                            Number(a.dataset.precio)
                        );

                    });

                } else {

                    vuelosArray.sort(function (a, b) {

                        return (
                            Number(a.dataset.ordenOriginal) -
                            Number(b.dataset.ordenOriginal)
                        );

                    });

                }

                vuelosArray.forEach(function (vuelo) {
                    contenedor.appendChild(vuelo);
                });

            }
        );

    }

    function aplicarFiltros() {

        console.log("Aplicando filtros");

    const precioMax = Number(rangePrecio.value);

    const aerolineasSeleccionadas = Array.from(
        document.querySelectorAll(".filtroAerolinea:checked")
    ).map(check => check.value);

    vuelos.forEach(function (vuelo) {

        // FILTRO DESTINO
        let coincideDestino = true;

        if (destinoBuscado) {

            const ciudades = vuelo.querySelectorAll(".ciudad");
            const ciudadDestino = ciudades[1].textContent.trim();

            coincideDestino =
                ciudadDestino.toLowerCase() ===
                destinoBuscado.toLowerCase();
        }

        // FILTRO PRECIO
        const coincidePrecio =
            Number(vuelo.dataset.precio) <= precioMax;

        // FILTRO AEROLÍNEA
        let coincideAerolinea = true;

        if (aerolineasSeleccionadas.length > 0) {

            const aerolinea =
                vuelo.querySelector(".aerolinea-option span")
                    .textContent;

            coincideAerolinea =
                aerolineasSeleccionadas.some(nombre =>
                    aerolinea.includes(nombre)
                );
        }

        // MOSTRAR U OCULTAR
        if (
            coincideDestino &&
            coincidePrecio &&
            coincideAerolinea
        ) {
            vuelo.style.display = "block";
        } else {
            vuelo.style.display = "none";
        }

    });
}

});


