document.addEventListener("DOMContentLoaded", () => {

    const email = localStorage.getItem("emailCliente");
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (email) {
        document.getElementById("emailCliente").textContent = email;
    }

    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados")) || [];
    const precioGuardado = localStorage.getItem("precioFinalPago");

    if (!vuelo) return;

    let emailPropietario;

    if (usuarioActivo) {
        emailPropietario = usuarioActivo.email;
    } else if (email) {
        emailPropietario = email;
    } else {
        emailPropietario = "desconocido";
    }

    const precio = Number(precioGuardado || 0);

    const precioFormateado = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "USD"
    }).format(precio);

    const reserva = {
        titulo: `Vuelo a ${vuelo.ciudadDestino || vuelo.destino}`,
        tipo: vuelo.salidaVuelta ? "Ida y Vuelta" : "Solo Ida",
        pasajeros: vuelo.personas || 1,

        ruta: `${vuelo.ciudadOrigen || vuelo.origen} - ${vuelo.ciudadDestino || vuelo.destino}`,

        horario: vuelo.salida,
        duracion: calcularDuracion(vuelo.salida, vuelo.llegada),

        precio: precioFormateado,
        clase: "Económica",

        asientoIda: asientos.join(", "),
        asientoVuelta: asientos.join(", "),

        fechaIda: vuelo.fechaIda,
        fechaVuelta: vuelo.fechaVuelta,

        horarioVuelta: vuelo.salidaVuelta,

        codigoReserva: "AL-" + Math.floor(Math.random() * 1000000),

        emailPropietario
    };

    const reservas = JSON.parse(localStorage.getItem("misReservas")) || [];

    reservas.push(reserva);

    localStorage.setItem("misReservas", JSON.stringify(reservas));

    localStorage.removeItem("vueloSeleccionado");
    localStorage.removeItem("asientoSeleccionado");
    localStorage.removeItem("precioFinalPago");
});

function calcularDuracion(salida, llegada) {

    if (!salida || !llegada) return "A confirmar";

    let [h1, m1] = salida.split(":").map(Number);
    let [h2, m2] = llegada.split(":").map(Number);

    let minutosSalida = h1 * 60 + m1;
    let minutosLlegada = h2 * 60 + m2;

    let diferencia = minutosLlegada - minutosSalida;

    if (diferencia < 0) {
        diferencia += 24 * 60;
    }

    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;

    return minutos === 0
        ? `${horas} hs`
        : `${horas} hs ${minutos} min`;
}