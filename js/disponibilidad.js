document.addEventListener("DOMContentLoaded", function () {

    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

    if (!vuelo) {
        alert("No hay vuelo seleccionado");
        window.location.href = "./resultados.html";
        return;
    }

    cargarDatosVuelo(vuelo);

    const asientos = document.querySelectorAll(".mapa .seat");
    const btnContinuar = document.getElementById("btnContinuar");
    const cardSeleccion = document.querySelector(".card_seleccion");

    const pasajeros = Number(vuelo.personas) || 1;

    // =====================
    // BLOQUEAR ASIENTOS YA COMPRADOS
    // =====================
    const claveVuelo = `comprados_${vuelo.origen}_${vuelo.destino}`;
    const asientosYaComprados = JSON.parse(localStorage.getItem(claveVuelo)) || [];

    asientos.forEach(function (asiento) {
        const codigo = getAsientoCode(asiento);
        
        if (asientosYaComprados.includes(codigo)) {
            asiento.classList.remove("disponible");
            asiento.classList.add("ocupado");
        }
    });

    const precioBase = Number(vuelo.precioBaseUnitario) || 0;
    const impuestos = Number(vuelo.impuestosUnitario) || 0;
    const equipaje = Number(vuelo.equipajeUnitario) || 0;
    const costoAsiento = Number(vuelo.asientoUnitario) || 25;

    let etapa = "ida";

    let asientosIda = [];
    let asientosVuelta = [];

    function obtenerListaActual() {
        return etapa === "ida"
            ? asientosIda
            : asientosVuelta;
    }

    document.querySelector(".ida").textContent =
        "Ida: " + vuelo.fechaIda;

    document.querySelector(".vuelta").textContent =
        "Vuelta: " + vuelo.fechaVuelta;

    actualizarBoton();
    actualizarDatos();

    // =====================
    // SELECCIÓN DE ASIENTOS
    // =====================

    asientos.forEach(function (asiento) {

        asiento.addEventListener("click", function () {

            if (asiento.classList.contains("ocupado")) return;

            const listaActual = obtenerListaActual();

            const index = listaActual.indexOf(asiento);

            if (index !== -1) {

                listaActual.splice(index, 1);

                asiento.classList.remove("seleccionado");
                asiento.classList.add("disponible");

            } else {

                if (listaActual.length >= pasajeros) {
                    alert(`Solo podés seleccionar ${pasajeros} asiento(s)`);
                    return;
                }

                listaActual.push(asiento);

                asiento.classList.add("seleccionado");
                asiento.classList.remove("disponible");

                // COMPLETÓ LOS ASIENTOS DE IDA
                if (
                    etapa === "ida" &&
                    asientosIda.length === pasajeros
                ) {

                    etapa = "vuelta";

                    document.getElementById("tituloMapa").textContent =
                        "Seleccioná los asientos de vuelta";

                    document
                        .querySelectorAll(".seat.seleccionado")
                        .forEach(seat => {

                            seat.classList.remove("seleccionado");
                            seat.classList.add("disponible");

                        });

                    actualizarDatos();
                }
            }

            actualizarDatos();
        });

    });

    // =====================
    // ACTUALIZAR PANTALLA
    // =====================

    function actualizarDatos() {

        const codigosIda = asientosIda.map(getAsientoCode);
        const codigosVuelta = asientosVuelta.map(getAsientoCode);

        const totalBase =
            (precioBase + impuestos + equipaje) * pasajeros;

        const totalAsientos =
            costoAsiento *
            (asientosIda.length + asientosVuelta.length);

        const totalFinal =
            totalBase + totalAsientos;

        vuelo.totalConAsientos = totalFinal;

        localStorage.setItem(
            "vueloSeleccionado",
            JSON.stringify(vuelo)
        );

        cardSeleccion.innerHTML = `
    <h3>Tu selección</h3>

    <p><strong>Etapa:</strong> ${etapa === "ida"
                ? "Seleccionando asientos de ida"
                : "Seleccionando asientos de vuelta"
            }</p>

    <p>Ida: ${codigosIda.length ? codigosIda.join(", ") : "Sin seleccionar"}</p>

    <p>Vuelta: ${codigosVuelta.length ? codigosVuelta.join(", ") : "Sin seleccionar"}</p>

    <p>Progreso Ida: ${asientosIda.length}/${pasajeros}</p>

    <p>Progreso Vuelta: ${asientosVuelta.length}/${pasajeros}</p>

    <p>Total asientos: ${vuelo.moneda} ${totalAsientos}</p>
`;

        document.getElementById("precioBase").textContent =
            `${vuelo.moneda}${precioBase * pasajeros}`;

        document.getElementById("precioImpuestos").textContent =
            `${vuelo.moneda}${impuestos * pasajeros}`;

        document.getElementById("precioEquipaje").textContent =
            `${vuelo.moneda}${equipaje * pasajeros}`;

        document.getElementById("precioAsientos").textContent =
            `${vuelo.moneda}${totalAsientos}`;

        document.getElementById("precioTotal").textContent =
            `${vuelo.moneda}${totalFinal}`;

        actualizarBoton();
    }

    // =====================
    // BOTÓN CONTINUAR
    // =====================

    function actualizarBoton() {

        if (
            asientosIda.length === pasajeros &&
            asientosVuelta.length === pasajeros
        ) {

            btnContinuar.style.pointerEvents = "auto";
            btnContinuar.style.opacity = "1";

        } else {

            btnContinuar.style.pointerEvents = "none";
            btnContinuar.style.opacity = "0.5";
        }
    }

    btnContinuar.addEventListener("click", function (e) {

        e.preventDefault();

        const codigosIda = asientosIda.map(getAsientoCode);
        const codigosVuelta = asientosVuelta.map(getAsientoCode);

        if (
            codigosIda.length !== pasajeros ||
            codigosVuelta.length !== pasajeros
        ) {
            alert(
                `Tenés que seleccionar ${pasajeros} asiento(s) para ida y vuelta`
            );
            return;
        }

        if (!localStorage.getItem("usuarioActivo")) {

            alert("Tenés que iniciar sesión");
            window.location.href = "./login.html";
            return;
        }

        const vueloActualizado =
            JSON.parse(localStorage.getItem("vueloSeleccionado"));

        vueloActualizado.asientosIda = codigosIda;
        vueloActualizado.asientosVuelta = codigosVuelta;

        localStorage.setItem(
            "vueloSeleccionado",
            JSON.stringify(vueloActualizado)
        );

        window.location.href = "./pago.html";
    });

    // =====================
    // CARGAR DATOS DEL VUELO
    // =====================

    function cargarDatosVuelo(vuelo) {

        document.getElementById("logoIda").src = vuelo.logo;
        document.getElementById("logoVuelta").src = vuelo.logo;

        document.getElementById("aerolineaIda").textContent = vuelo.aerolinea;
        document.getElementById("aerolineaVuelta").textContent = vuelo.aerolinea;

        document.getElementById("horaSalidaIda").textContent = vuelo.salida;
        document.getElementById("horaLlegadaIda").textContent = vuelo.llegada;
        document.getElementById("duracionIda").textContent = vuelo.duracion;

        document.querySelectorAll(".escala").forEach(function (escala) {
            escala.textContent = vuelo.tipoVuelo;
        });

        document.getElementById("origenIda").textContent = vuelo.origen;
        document.getElementById("ciudadOrigenIda").textContent = vuelo.ciudadOrigen;

        document.getElementById("destinoIda").textContent = vuelo.destino;
        document.getElementById("ciudadDestinoIda").textContent = vuelo.ciudadDestino;

        document.getElementById("horaSalidaVuelta").textContent = vuelo.salidaVuelta;
        document.getElementById("horaLlegadaVuelta").textContent = vuelo.llegadaVuelta;
        document.getElementById("duracionVuelta").textContent = vuelo.duracionVuelta;

        document.getElementById("origenVuelta").textContent = vuelo.destino;
        document.getElementById("ciudadOrigenVuelta").textContent = vuelo.ciudadDestino;

        document.getElementById("destinoVuelta").textContent = vuelo.origen;
        document.getElementById("ciudadDestinoVuelta").textContent = vuelo.ciudadOrigen;

        document.getElementById("cantidadPasajeros").textContent =
            `${vuelo.personas} Pasajero(s)`;
    }

    // =====================
    // CÓDIGO DE ASIENTO
    // =====================

    function getAsientoCode(asiento) {

        const fila = asiento.parentElement;

        const numeroFila =
            fila.querySelector("span").textContent;

        const letras =
            ["A", "B", "C", "D", "E", "F", "G", "H"];

        const botones =
            fila.querySelectorAll("button");

        let index = 0;

        botones.forEach(function (boton, i) {

            if (boton === asiento) {
                index = i;
            }

        });

        return numeroFila + letras[index];
    }

});