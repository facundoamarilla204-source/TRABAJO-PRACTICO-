document.addEventListener("DOMContentLoaded", () => {

    const email = localStorage.getItem("emailCliente");

    if (email) {
        document.getElementById("emailCliente").textContent = email;
    }

    // --- LÓGICA PARA GUARDAR LA RESERVA ---
    
    // 1. Traemos los datos que guardó la página anterior
    const vueloString = localStorage.getItem("vueloSeleccionado");
    const asiento = localStorage.getItem("asientoSeleccionado") || "Sin seleccionar";

    if (vueloString) {
        const vuelo = JSON.parse(vueloString);

        // 2. Armamos el objeto con el formato exacto que espera perfil.js
        const nuevaReserva = {
            titulo: `Vuelo a ${vuelo.ciudadDestino || vuelo.destino}`,
            tipo: vuelo.salidaVuelta ? "Ida y Vuelta" : "Solo Ida",
            pasajeros: 1, 
            ruta: `${vuelo.ciudadOrigen || vuelo.origen} - ${vuelo.ciudadDestino || vuelo.destino}`,
            horario: vuelo.salida,
            duracion: "A confirmar", 
            precio: vuelo.total, 
            clase: "Económica", 
            asientoIda: asiento,
            fechaVuelta: vuelo.salidaVuelta ? "Confirmada" : "No aplica",
            horarioVuelta: vuelo.llegadaVuelta || "--:--",
            asientoVuelta: "A confirmar"
        };

        // 3. Traemos las reservas del usuario o creamos el array si es la primera vez
        let reservasActuales = JSON.parse(localStorage.getItem("misReservas")) || [];

        // 4. Guardamos la nueva reserva en el array
        reservasActuales.push(nuevaReserva);
        localStorage.setItem("misReservas", JSON.stringify(reservasActuales));

        // 5. BORRAMOS el vuelo temporal para evitar que se duplique si el usuario recarga la página con F5
        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("asientoSeleccionado");
    }

});