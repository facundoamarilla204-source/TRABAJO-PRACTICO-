document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("emailCliente");

    if (email) {
        document.getElementById("emailCliente").textContent = email;
    }

    function calcularDuracion(horaSalida, horaLlegada) {
        if (!horaSalida || !horaLlegada) return "A confirmar";

        let [horasS, minsS] = horaSalida.split(':').map(Number);
        let [horasL, minsL] = horaLlegada.split(':').map(Number);

        let totalMinutosSalida = (horasS * 60) + minsS;
        let totalMinutosLlegada = (horasL * 60) + minsL;

        let diferencia = totalMinutosLlegada - totalMinutosSalida;

        if (diferencia < 0) {
            diferencia += 24 * 60; 
        }

        let horasVuelo = Math.floor(diferencia / 60);
        let minutosVuelo = diferencia % 60;

        if (minutosVuelo === 0) {
            return `${horasVuelo} hs`;
        } else {
            return `${horasVuelo} hs ${minutosVuelo} min`;
        }
    }

    const vueloString = localStorage.getItem("vueloSeleccionado");
    const asiento = localStorage.getItem("asientoSeleccionado") || "Sin seleccionar";
    const precioGuardado = localStorage.getItem("precioFinalPago");

    if (vueloString) {
        const vuelo = JSON.parse(vueloString);
        const duracionIda = calcularDuracion(vuelo.salida, vuelo.llegada);
        
        let precioCrudo = precioGuardado || vuelo.total;
        let soloNumeros = String(precioCrudo).replace(/\D/g, ""); 
        const precioNumerico = parseInt(soloNumeros) || 0;
        
        const precioFormateado = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(precioNumerico);
        
        const codigoGenerado = "AL-" + Math.floor(Math.random() * 1000000);

        const nuevaReserva = {
            titulo: `Vuelo a ${vuelo.ciudadDestino || vuelo.destino}`,
            tipo: vuelo.salidaVuelta ? "Ida y Vuelta" : "Solo Ida",
            pasajeros: 1, 
            ruta: `${vuelo.ciudadOrigen || vuelo.origen} - ${vuelo.ciudadDestino || vuelo.destino}`,
            horario: vuelo.salida,
            duracion: duracionIda,
            precio: precioFormateado, 
            clase: "Económica", 
            asientoIda: asiento,
            fechaVuelta: "No aplica",
            horarioVuelta: "Por definir",
            asientoVuelta: "No aplica",
            codigoReserva: codigoGenerado
        };

        let reservasActuales = JSON.parse(localStorage.getItem("misReservas")) || [];
        reservasActuales.push(nuevaReserva);
        localStorage.setItem("misReservas", JSON.stringify(reservasActuales));

        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("asientoSeleccionado");
        localStorage.removeItem("precioFinalPago");
    }
});