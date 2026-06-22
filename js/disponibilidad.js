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
    
    const btnEtapaIda = document.getElementById("btnEtapaIda");
    const btnEtapaVuelta = document.getElementById("btnEtapaVuelta");

    const pasajeros = Number(vuelo.personas) || 1;

    const precioBase = Number(vuelo.precioBaseUnitario) || 0;
    const impuestos = Number(vuelo.impuestosUnitario) || 0;
    const equipaje = Number(vuelo.equipajeUnitario) || 0;
    const costoAsiento = Number(vuelo.asientoUnitario) || 25;

    let etapa = "ida";
    let asientosIda = [];
    let asientosVuelta = [];

    // ==========================================
    // 1. GUARDAR ASIENTOS ARTIFICIALES DEL HTML
    // ==========================================
    const asientosBaseOcupados = [];
    asientos.forEach(asiento => {
        if (asiento.classList.contains("ocupado")) {
            asientosBaseOcupados.push(getAsientoCode(asiento));
        }
    });

    // ==========================================
    // 2. FUNCIÓN PARA BLOQUEAR ASIENTOS
    // ==========================================
    function bloquearAsientosSegunEtapa(etapaActual) {

        asientos.forEach(asiento => {
            asiento.classList.remove("ocupado", "seleccionado");
            asiento.classList.add("disponible");
        });

        const origenRuta = etapaActual === "ida" ? vuelo.origen : vuelo.destino;
        const destinoRuta = etapaActual === "ida" ? vuelo.destino : vuelo.origen;
        
        const claveBuscada = `comprados_${origenRuta}_${destinoRuta}`;
        const asientosYaComprados = JSON.parse(localStorage.getItem(claveBuscada)) || [];

        const todosOcupados = [...asientosBaseOcupados, ...asientosYaComprados];

        asientos.forEach(function (asiento) {
            const codigo = getAsientoCode(asiento);
            if (todosOcupados.includes(codigo)) {
                asiento.classList.remove("disponible", "seleccionado");
                asiento.classList.add("ocupado");
            }
        });
    }

    // ==========================================
    // 3. FUNCIÓN PARA CAMBIAR ENTRE IDA Y VUELTA
    // ==========================================
    function cambiarEtapa(nuevaEtapa) {
        etapa = nuevaEtapa;

        if (btnEtapaIda && btnEtapaVuelta) {
            if (etapa === "ida") {
                btnEtapaIda.classList.add("activo");
                btnEtapaVuelta.classList.remove("activo");
            } else {
                btnEtapaIda.classList.remove("activo");
                btnEtapaVuelta.classList.add("activo");
            }
        }

        document.getElementById("tituloMapa").textContent =
            etapa === "ida" ? "Seleccioná los asientos de ida" : "Seleccioná los asientos de vuelta";

        bloquearAsientosSegunEtapa(etapa);

        const listaActual = obtenerListaActual();
        listaActual.forEach(asiento => {
            asiento.classList.remove("disponible");
            asiento.classList.add("seleccionado");
        });

        actualizarDatos();
    }

    if (btnEtapaIda) btnEtapaIda.addEventListener("click", () => cambiarEtapa("ida"));
    if (btnEtapaVuelta) btnEtapaVuelta.addEventListener("click", () => cambiarEtapa("vuelta"));

    function obtenerListaActual() {
        return etapa === "ida" ? asientosIda : asientosVuelta;
    }

    document.querySelector(".ida").textContent = "Ida: " + (vuelo.fechaIda || "");
    document.querySelector(".vuelta").textContent = "Vuelta: " + (vuelo.fechaVuelta || "");

    // =====================
    // 4. SELECCIÓN DE ASIENTOS
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

                if (etapa === "ida" && asientosIda.length === pasajeros) {
                    setTimeout(() => {
                        cambiarEtapa("vuelta");
                    }, 300); 
                    return; 
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

        const totalBase = (precioBase + impuestos + equipaje) * pasajeros;
        const totalAsientos = costoAsiento * (asientosIda.length + asientosVuelta.length);
        const totalFinal = totalBase + totalAsientos;

        vuelo.totalConAsientos = totalFinal;

        localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

        cardSeleccion.innerHTML = `
            <h3>Tu selección</h3>
            <p><strong>Etapa:</strong> ${etapa === "ida" ? "Seleccionando asientos de ida" : "Seleccionando asientos de vuelta"}</p>
            <p>Ida: ${codigosIda.length ? codigosIda.join(", ") : "Sin seleccionar"}</p>
            <p>Vuelta: ${codigosVuelta.length ? codigosVuelta.join(", ") : "Sin seleccionar"}</p>
            <p>Progreso Ida: ${asientosIda.length}/${pasajeros}</p>
            <p>Progreso Vuelta: ${asientosVuelta.length}/${pasajeros}</p>
            <p>Total asientos: ${vuelo.moneda || "USD"} ${totalAsientos}</p>
        `;

        document.getElementById("precioBase").textContent = `${vuelo.moneda || "USD"}${precioBase * pasajeros}`;
        document.getElementById("precioImpuestos").textContent = `${vuelo.moneda || "USD"}${impuestos * pasajeros}`;
        document.getElementById("precioEquipaje").textContent = `${vuelo.moneda || "USD"}${equipaje * pasajeros}`;
        document.getElementById("precioAsientos").textContent = `${vuelo.moneda || "USD"}${totalAsientos}`;
        document.getElementById("precioTotal").textContent = `${vuelo.moneda || "USD"}${totalFinal}`;

        actualizarBoton();
    }

    // =====================
    // BOTÓN CONTINUAR
    // =====================
    function actualizarBoton() {
        if (asientosIda.length === pasajeros && asientosVuelta.length === pasajeros) {
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

        if (codigosIda.length !== pasajeros || codigosVuelta.length !== pasajeros) {
            alert(`Tenés que seleccionar ${pasajeros} asiento(s) para ida y vuelta`);
            return;
        }

        if (!localStorage.getItem("usuarioActivo")) {
            alert("¡Ya casi! Para comprar el pasaje tenés que iniciar sesión o registrarte.");
            window.location.href = "./login.html";
            return;
        }

        const vueloActualizado = JSON.parse(localStorage.getItem("vueloSeleccionado"));
        vueloActualizado.asientosIda = codigosIda;
        vueloActualizado.asientosVuelta = codigosVuelta;

        localStorage.setItem("vueloSeleccionado", JSON.stringify(vueloActualizado));
        window.location.href = "./pago.html";
    });

    // =====================
    // CARGAR DATOS DEL VUELO
    // =====================
    function cargarDatosVuelo(vuelo) {
        document.getElementById("logoIda").src = vuelo.logo || "../img/aerolineasArgentinas.png";
        document.getElementById("logoVuelta").src = vuelo.logo || "../img/aerolineasArgentinas.png";

        document.getElementById("aerolineaIda").textContent = vuelo.aerolinea;
        document.getElementById("aerolineaVuelta").textContent = vuelo.aerolinea;

        document.getElementById("horaSalidaIda").textContent = vuelo.salida;
        document.getElementById("horaLlegadaIda").textContent = vuelo.llegada;
        document.getElementById("duracionIda").textContent = vuelo.duracion;

        document.querySelectorAll(".escala").forEach(function (escala) {
            escala.textContent = vuelo.tipoVuelo || "Directo";
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

        document.getElementById("cantidadPasajeros").textContent = `${vuelo.personas} Pasajero(s)`;
    }

    // =====================
    // CÓDIGO DE ASIENTO
    // =====================
    function getAsientoCode(asiento) {
        const fila = asiento.parentElement;
        const numeroFila = fila.querySelector("span").textContent;
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const botones = fila.querySelectorAll("button");
        let index = 0;

        botones.forEach(function (boton, i) {
            if (boton === asiento) {
                index = i;
            }
        });

        return numeroFila + letras[index];
    }

    // INICIALIZAMOS LA PANTALLA EN LA IDA
    cambiarEtapa("ida");

});