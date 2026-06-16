document.addEventListener("DOMContentLoaded", function () {
    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

    if (vuelo !== null) {
        cargarDatosVuelo(vuelo);
    }

    const asientos = document.querySelectorAll(".mapa .seat");
    const cardSeleccion = document.querySelector(".card_seleccion");
    const btnContinuar = document.getElementById("btnContinuar");

    let asientoElegido = "";

    for (let i = 0; i < asientos.length; i++) {
        asientos[i].addEventListener("click", function () {
            if (asientos[i].classList.contains("ocupado")) {
                alert("Ese asiento ya está ocupado");
                return;
            }

            for (let j = 0; j < asientos.length; j++) {
                asientos[j].classList.remove("seleccionado");

                if (!asientos[j].classList.contains("ocupado")) {
                    asientos[j].classList.add("disponible");
                }
            }

            asientos[i].classList.remove("disponible");
            asientos[i].classList.add("seleccionado");

            asientoElegido = obtenerAsiento(asientos[i]);

            cardSeleccion.innerHTML = `
                <h3>Tu selección</h3>
                <p>Ida: Asiento ${asientoElegido}</p>
                <p>Vuelta: Se asignará luego</p>
                <p>Total asientos: USD 25</p>
            `;

            localStorage.setItem("asientoSeleccionado", asientoElegido);
        });
    }

    btnContinuar.addEventListener("click", function (e) {
        
        if (asientoElegido === "") {
            e.preventDefault();
            alert("Tenés que seleccionar un asiento antes de continuar");
            return; 
        }

        const usuarioActivo = localStorage.getItem('usuarioActivo');
        
        if (!usuarioActivo) {
            e.preventDefault();
            alert("¡Ya casi! Para comprar el pasaje tenés que iniciar sesión o registrarte.");
            
            window.location.href = "login.html"; 
        }
    });
});

function cargarDatosVuelo(vuelo) {
    document.getElementById("logoIda").src = vuelo.logo;
    document.getElementById("logoVuelta").src = vuelo.logo;

    document.getElementById("aerolineaIda").textContent = vuelo.aerolinea;
    document.getElementById("aerolineaVuelta").textContent = vuelo.aerolinea;

    document.getElementById("horaSalidaIda").textContent = vuelo.salida;
    document.getElementById("horaLlegadaIda").textContent = vuelo.llegada;
    document.getElementById("duracionIda").textContent = vuelo.duracion;

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

    document.getElementById("precioBase").textContent = vuelo.moneda + " " + vuelo.precioBase;
    document.getElementById("precioEquipaje").textContent = vuelo.moneda + " " + vuelo.equipaje;
    document.getElementById("precioAsientos").textContent = vuelo.moneda + " " + vuelo.asientos;
    document.getElementById("precioImpuestos").textContent = vuelo.moneda + " " + vuelo.impuestos;
    document.getElementById("precioTotal").textContent = vuelo.moneda + " " + vuelo.total;

    document.getElementById("btnContinuar").href = vuelo.pago;
}

function obtenerAsiento(asiento) {
    const fila = asiento.parentElement;
    const numeroFila = fila.querySelector("span").textContent;
    const botones = fila.querySelectorAll("button");
    const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

    let posicion = 0;

    for (let i = 0; i < botones.length; i++) {
        if (botones[i] === asiento) {
            posicion = i;
        }
    }

    return numeroFila + letras[posicion];
}