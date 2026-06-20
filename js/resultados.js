document.addEventListener("DOMContentLoaded", function () {

// =========================
// DATOS BÚSQUEDA
// =========================
const destinoBuscado = localStorage.getItem("destino");
const fechaIdaBuscada = localStorage.getItem("fechaIda");
const fechaVueltaBuscada = localStorage.getItem("fechaVuelta");

let equipajeSeleccionado = 0;

// =========================
// EQUIPAJE
// =========================
const equipajes = document.querySelectorAll(".equipaje-card");

equipajes.forEach(function (equipaje) {

    equipaje.addEventListener("click", function () {

        equipajes.forEach(function (e) {
            e.classList.remove("seleccionado");
        });

        this.classList.add("seleccionado");

        const valor = Number(this.dataset.equipaje);

        if (isNaN(valor)) {
            equipajeSeleccionado = 0;
        } else {
            equipajeSeleccionado = valor;
        }

    });

});

// =========================
// SELECCIONAR VUELO
// =========================
const botones = document.querySelectorAll(".btn-select");

botones.forEach(function (btn) {

    btn.addEventListener("click", function (e) {

        e.preventDefault();

        const personas =
            Number(localStorage.getItem("personas")) || 1;

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

            precioBaseUnitario:
                Number(btn.dataset.precioBase),

            impuestosUnitario:
                Number(btn.dataset.impuestos),

            asientoUnitario:
                Number(btn.dataset.asientos),

            equipajeUnitario:
                equipajeSeleccionado,

            personas: personas,

            pago: btn.dataset.pago,

            fechaIda: fechaIdaBuscada,
            fechaVuelta: fechaVueltaBuscada,

            tipoVuelo: btn.dataset.tipoVuelo
        };

        localStorage.setItem(
            "vueloSeleccionado",
            JSON.stringify(vuelo)
        );

        localStorage.removeItem("asientosSeleccionados");

        window.location.href =
            "./disponibilidad.html";

    });

});

// =========================
// FILTROS
// =========================
const vuelos =
    document.querySelectorAll(".vuelo-card");

for (let i = 0; i < vuelos.length; i++) {
    vuelos[i].dataset.ordenOriginal = i;
}

const rangePrecio =
    document.getElementById("filtroPrecio");

const valorPrecio =
    document.getElementById("valorPrecio");

const filtroAerolineas =
    document.querySelectorAll(".filtroAerolinea");

const filtroTipoVuelo =
    document.querySelectorAll(".filtroTipoVuelo");

filtroAerolineas.forEach(function (checkBox) {
    checkBox.addEventListener("change", aplicarFiltros);
});

filtroTipoVuelo.forEach(function (checkBox) {
    checkBox.addEventListener("change", aplicarFiltros);
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
const selectOrdenar =
    document.querySelector(".select_ordenar");

if (selectOrdenar) {

    selectOrdenar.addEventListener("change", function () {

        const contenedor =
            document.querySelector(".lista-vuelos");

        const vuelosArray =
            Array.from(document.querySelectorAll(".vuelo-card"));

        if (this.value === "Precio menor") {

            vuelosArray.sort(function (a, b) {

                return (
                    Number(a.dataset.precio) -
                    Number(b.dataset.precio)
                );

            });

        }

        else if (this.value === "Precio mayor") {

            vuelosArray.sort(function (a, b) {

                return (
                    Number(b.dataset.precio) -
                    Number(a.dataset.precio)
                );

            });

        }

        else {

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

    });

}

// =========================
// FUNCIÓN FILTROS
// =========================
function aplicarFiltros() {

    const precioMax =
        Number(rangePrecio.value);

    let cantidadVuelos = 0;

    vuelos.forEach(function (vuelo) {

        // -------------------
        // PRECIO
        // -------------------
        const precioVuelo =
            Number(vuelo.dataset.precio);

        let coincidePrecio = false;

        if (precioVuelo <= precioMax) {
            coincidePrecio = true;
        }

        // -------------------
        // AEROLÍNEA
        // -------------------
        let coincideAerolinea = true;

        const aerolineasMarcadas =
            document.querySelectorAll(".filtroAerolinea:checked");

        if (aerolineasMarcadas.length > 0) {

            coincideAerolinea = false;

            aerolineasMarcadas.forEach(function (check) {

                const aerolineasVuelo =
                    vuelo.querySelectorAll(".aerolinea-option span");

                aerolineasVuelo.forEach(function (aerolinea) {

                    if (
                        aerolinea.textContent.toLowerCase() ===
                        check.value.toLowerCase()
                    ) {
                        coincideAerolinea = true;
                    }

                });

            });

        }

        // -------------------
        // DESTINO
        // -------------------
        let coincideDestino = true;

        if (destinoBuscado) {

            const ciudadDestino =
                vuelo.querySelectorAll(".ciudad")[1].textContent;

            if (
                ciudadDestino.toLowerCase() !==
                destinoBuscado.toLowerCase()
            ) {
                coincideDestino = false;
            }

        }

        // -------------------
        // FECHAS
        // -------------------
        let coincideFecha = true;

        if (fechaIdaBuscada && fechaVueltaBuscada) {

            if (
                vuelo.dataset.fechaIda !== fechaIdaBuscada ||
                vuelo.dataset.fechaVuelta !== fechaVueltaBuscada
            ) {
                coincideFecha = false;
            }

        }

        // -------------------
        // TIPO DE VUELO
        // -------------------
        let coincideTipoVuelo = true;

        const tiposMarcados =
            document.querySelectorAll(".filtroTipoVuelo:checked");

        if (tiposMarcados.length > 0) {

            coincideTipoVuelo = false;

            const tipoVuelo =
                vuelo.querySelector(".btn-select")
                    .dataset.tipoVuelo
                    .toLowerCase();

            tiposMarcados.forEach(function (check) {

                if (
                    tipoVuelo ===
                    check.value.toLowerCase()
                ) {
                    coincideTipoVuelo = true;
                }

            });

        }

        // -------------------
        // MOSTRAR / OCULTAR
        // -------------------
        if (
            coincidePrecio &&
            coincideAerolinea &&
            coincideDestino &&
            coincideFecha &&
            coincideTipoVuelo
        ) {

            vuelo.style.display = "block";
            cantidadVuelos++;

        } else {

            vuelo.style.display = "none";

        }

    });

    document.getElementById("cantidadVuelos").textContent =
        cantidadVuelos;

}

aplicarFiltros();


});
