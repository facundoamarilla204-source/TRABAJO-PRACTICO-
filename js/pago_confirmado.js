document.addEventListener("DOMContentLoaded", () => {

    const email = localStorage.getItem("emailCliente");

    if (email) {
        document.getElementById("emailCliente").textContent = email;
    }
    
    const vueloString = localStorage.getItem("vueloSeleccionado");
    const asiento = localStorage.getItem("asientoSeleccionado") || "Sin seleccionar";

    if (vueloString) {
        const vuelo = JSON.parse(vueloString);

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

        let reservasActuales = JSON.parse(localStorage.getItem("misReservas")) || [];

        reservasActuales.push(nuevaReserva);
        localStorage.setItem("misReservas", JSON.stringify(reservasActuales));

        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("asientoSeleccionado");
    }

});