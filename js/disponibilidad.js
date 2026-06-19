document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // TRAER VUELO
    // =========================
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

    let seleccionados = [];

    // =========================
    // COSTOS BASE
    // =========================
    const precioBase = Number(vuelo.precioBaseUnitario) || 0;
    const impuestos = Number(vuelo.impuestosUnitario) || 0;
    const equipaje = Number(vuelo.equipajeUnitario) || 0;

    const costoAsientoUnitario = Number(vuelo.asientoUnitario) || 25;

    const ida = document.querySelector(".ida");
    const vuelta = document.querySelector(".vuelta");

    ida.textContent = "Ida: " + vuelo.fechaIda;
    vuelta.textContent = "Vuelta: " + vuelo.fechaVuelta;



    // =========================
    // BOTÓN INICIAL
    // =========================
    deshabilitarBoton();

    function deshabilitarBoton() {
        btnContinuar.style.pointerEvents = "none";
        btnContinuar.style.opacity = "0.5";
    }

    function habilitarBoton() {
        btnContinuar.style.pointerEvents = "auto";
        btnContinuar.style.opacity = "1";
    }

    // =========================
    // CLICK ASIENTOS
    // =========================
    asientos.forEach((seat) => {

        seat.addEventListener("click", () => {

            if (seat.classList.contains("ocupado")) return;

            const index = seleccionados.indexOf(seat);

            if (index !== -1) {
                seleccionados.splice(index, 1);
                seat.classList.remove("seleccionado");
                seat.classList.add("disponible");
            } else {

                if (seleccionados.length >= pasajeros) {
                    alert(`Solo podés seleccionar ${pasajeros} asiento(s)`);
                    return;
                }

                seleccionados.push(seat);
                seat.classList.add("seleccionado");
                seat.classList.remove("disponible");
            }

            actualizarUI();
        });

    });

    // =========================
    // UI
    // =========================
    function actualizarUI() {

        const codigos = seleccionados.map(getAsientoCode);

        // =========================
        // CÁLCULOS
        // =========================
        const totalBase = (precioBase + impuestos + equipaje) * pasajeros;
        const totalAsientos = costoAsientoUnitario * seleccionados.length;
        const totalFinal = totalBase + totalAsientos;

        // 🔥 GUARDADO CLAVE PARA PAGO.JS
        vuelo.totalConAsientos = totalFinal;
        localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

        // =========================
        // RESUMEN LATERAL
        // =========================
        cardSeleccion.innerHTML = `
            <h3>Tu selección</h3>
            <p>Ida: ${codigos.length ? codigos.join(", ") : "Sin seleccionar"}</p>
            <p>Vuelta: Se asignará luego</p>
            <p>Progreso: ${seleccionados.length}/${pasajeros}</p>
            <p>Total asientos: ${vuelo.moneda} ${totalAsientos}</p>
        `;

        // =========================
        // UI PRECIOS
        // =========================
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

        // =========================
        // BOTÓN
        // =========================
        if (seleccionados.length === pasajeros) {
            habilitarBoton();
        } else {
            deshabilitarBoton();
        }
    }

    // =========================
    // CONTINUAR
    // =========================
    btnContinuar.addEventListener("click", (e) => {
        e.preventDefault();

        const codigos = seleccionados.map(getAsientoCode);

        if (codigos.length !== pasajeros) {
            alert(`Tenés que seleccionar ${pasajeros} asiento(s)`);
            return;
        }

        const usuario = localStorage.getItem("usuarioActivo");

        if (!usuario) {
            alert("Tenés que iniciar sesión");
            window.location.href = "./login.html";
            return;
        }

        // guardo asientos
        localStorage.setItem("asientosSeleccionados", JSON.stringify(codigos));

        const vueloActualizado = JSON.parse(localStorage.getItem("vueloSeleccionado"));

        localStorage.setItem("vueloSeleccionado", JSON.stringify({
            ...vueloActualizado,
            totalConAsientos: vueloActualizado.totalConAsientos,
            asientosSeleccionados: codigos
        }));

        // voy a pago
        window.location.href = "./pago.html";
    });

    // =========================
    // CARGAR VUELO
    // =========================
    function cargarDatosVuelo(v) {

        document.getElementById("logoIda").src = v.logo;
        document.getElementById("logoVuelta").src = v.logo;

        document.getElementById("aerolineaIda").textContent = v.aerolinea;
        document.getElementById("aerolineaVuelta").textContent = v.aerolinea;

        document.getElementById("horaSalidaIda").textContent = v.salida;
        document.getElementById("horaLlegadaIda").textContent = v.llegada;
        document.getElementById("duracionIda").textContent = v.duracion;

        document.getElementById("origenIda").textContent = v.origen;
        document.getElementById("ciudadOrigenIda").textContent = v.ciudadOrigen;
        document.getElementById("destinoIda").textContent = v.destino;
        document.getElementById("ciudadDestinoIda").textContent = v.ciudadDestino;

        document.getElementById("horaSalidaVuelta").textContent = v.salidaVuelta;
        document.getElementById("horaLlegadaVuelta").textContent = v.llegadaVuelta;
        document.getElementById("duracionVuelta").textContent = v.duracionVuelta;

        document.getElementById("origenVuelta").textContent = v.destino;
        document.getElementById("ciudadOrigenVuelta").textContent = v.ciudadDestino;
        document.getElementById("destinoVuelta").textContent = v.origen;
        document.getElementById("ciudadDestinoVuelta").textContent = v.ciudadOrigen;

        document.getElementById("cantidadPasajeros").textContent =
            `${v.personas} Pasajero(s)`;
    }

    // =========================
    // ASIENTO CODE
    // =========================
    function getAsientoCode(seat) {

        const fila = seat.parentElement;
        const numeroFila = fila.querySelector("span").textContent;

        const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

        const botones = fila.querySelectorAll("button");

        let index = 0;

        botones.forEach((b, i) => {
            if (b === seat) index = i;
        });

        return numeroFila + letras[index];
    }

});