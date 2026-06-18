 document.addEventListener("DOMContentLoaded", function () {

    // FILTRO SEGÚN BÚSQUEDA DEL HOME
    const destinoBuscado = localStorage.getItem("destino");

    console.log("Destino buscado:", destinoBuscado);

    if (destinoBuscado) {

        const vuelosFiltrar = document.querySelectorAll(".vuelo-card");

        vuelosFiltrar.forEach(function (vuelo) {

            const ciudades = vuelo.querySelectorAll(".ciudad");
            const ciudadDestino = ciudades[1].textContent.trim();

            console.log("Vuelo:", ciudadDestino);

            if (
                ciudadDestino.toLowerCase() !==
                destinoBuscado.toLowerCase()
            ) {
                vuelo.style.display = "none";
            }

        });

    }

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
                   equipaje:equipaje,
                  asientos: this.dataset.asientos,s
                  impuestos: this.dataset.impuestos,
                  total:totalbase + equipaje,
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

    if (rangePrecio) {

        rangePrecio.addEventListener("input", function () {

            valorPrecio.textContent = this.value;

            vuelos.forEach(function (vuelo) {

                const precio = Number(vuelo.dataset.precio);

                if (precio <= Number(rangePrecio.value)) {
                    vuelo.style.display = "block";
                } else {
                    vuelo.style.display = "none";
                }

            });

        });

    }

    // FILTRO DE AEROLÍNEAS
    const filtroAerolineas =
        document.querySelectorAll(".filtroAerolinea");

    filtroAerolineas.forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

            vuelos.forEach(function (vuelo) {

                const aerolinea =
                    vuelo.querySelector(".aerolinea-option span")
                        .textContent;

                let mostrar = false;

                filtroAerolineas.forEach(function (check) {

                    if (
                        check.checked &&
                        aerolinea.includes(check.value)
                    ) {
                        mostrar = true;
                    }

                });

                if (
                    document.querySelectorAll(
                        ".filtroAerolinea:checked"
                    ).length === 0
                ) {
                    mostrar = true;
                }

                vuelo.style.display =
                    mostrar ? "block" : "none";

            });

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
                    document.querySelector(".resultados");

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

});


