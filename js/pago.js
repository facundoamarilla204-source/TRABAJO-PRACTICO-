const form = document.querySelector("form");

const input_dni = document.querySelector(".input_documento_pasaporte");
const input_tarjeta = document.querySelector(".input_tarjeta");
const input_cvv = document.querySelector(".input_cvv");
const input_fecha_vencimiento = document.querySelector(".input_fecha_vencimiento");
const select_documento_pasaporte = document.querySelector(".select_dni_pasaporte");
const radios = document.querySelectorAll('input[name="metodo_pago"]');
const input_telefono = document.querySelector(".input_telefono");
const button_cupon = document.querySelector(".button_cupon");
const input_cupon = document.querySelector(".input_cupon");
const input_email = document.querySelector(".input_email");

const mensaje_dni_pasaporte_incorrecto = document.querySelector(".dni_pasaporte_incorrecto");
const mensaje_telefono_incorrecto = document.querySelector(".numero_incorrecto");
const mensaje_numero_tarjeta_incorrecto = document.querySelector(".numero_tarjeta_incorrecta");
const mensaje_fecha_vencimiento_incorrecta = document.querySelector(".fecha_vencimiento_incorrecta");
const mensaje_cvv_incorrecto = document.querySelector(".cvv_incorrecta");
const mensaje_cupon_invalido = document.querySelector(".cupon_invalido");
const mensaje_cupon_aplicado = document.querySelector(".cupon_aplicado");

const datos_tarjeta_oculta = document.querySelector(".tarjeta_datos_oculta");
const datos_transferencia_oculta = document.querySelector(".transferencia_oculto");

const total_precio_chico = document.querySelector(".total_precio_chico");
const total_precio = document.querySelector(".total_precio_numero");

let totalBaseGlobal = 0;
let cuponAplicado = false;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados"));

    if (!vuelo) {
        alert("No hay vuelo seleccionado");
        window.location.href = "./resultados.html";
        return;
    }

    const pasajeros = Number(vuelo.personas) || 1;

    // =========================
    // TOTAL
    // =========================
    let total;

    if (vuelo.totalConAsientos !== null && vuelo.totalConAsientos !== undefined) {
        total = Number(vuelo.totalConAsientos);
    } else {
        total = Number(vuelo.total);
    }

    totalBaseGlobal = total;

    // =========================
    // RENDER
    // =========================

    document.getElementById("origenIdaCheckout").textContent = vuelo.origen;
    document.getElementById("destinoIdaCheckout").textContent = vuelo.destino;

    document.getElementById("horarioIdaCheckout").textContent =
        `${vuelo.fechaIda || ""} - ${vuelo.salida} - ${vuelo.llegada}`;

    document.getElementById("origenVueltaCheckout").textContent = vuelo.destino;
    document.getElementById("destinoVueltaCheckout").textContent = vuelo.origen;

    document.getElementById("horarioVueltaCheckout").textContent =
        `${vuelo.fechaVuelta || ""} - ${vuelo.salidaVuelta} - ${vuelo.llegadaVuelta}`;


    document.getElementById("totalCheckout").textContent = total;
    document.getElementById("totalCheckoutGrande").textContent = total;

    document.getElementById("asientoCheckout").textContent =
        asientos.length > 0
            ? `${asientos.join(", ")} (${pasajeros})`
            : "Sin seleccionar";
});

// =========================
// VALIDACIONES INPUT
// =========================
input_tarjeta.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16);
});

input_cvv.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});

input_telefono.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
});

input_fecha_vencimiento.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value;
});

// =========================
// SUBMIT
// =========================

form.addEventListener("submit", (e) => {
    
    e.preventDefault(); 

    localStorage.setItem("emailCliente", input_email.value);
    localStorage.setItem("precioFinalPago", total_precio.textContent);

    const numero_tarjeta = input_tarjeta.value;
    const cvv = input_cvv.value;
    const fecha_vencimiento = input_fecha_vencimiento.value;

    const dni_pasaporte_valido = corroborar_pasaporte_valido_dni();
    const telefono_valido = corroborar_numero_telefono();

    const metodo_pago_seleccionado = document.querySelector('input[name="metodo_pago"]:checked');

    let tarjeta_valida = true;

    if (metodo_pago_seleccionado && metodo_pago_seleccionado.value === "tarjeta_credito") {
        tarjeta_valida = validar_tarjeta(numero_tarjeta, cvv, fecha_vencimiento);
    }

    if (!dni_pasaporte_valido || !telefono_valido || !tarjeta_valida) {
        return; 
    }

    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para finalizar la compra.");
        window.location.href = "./login.html";
        return;
    }

    if (vuelo) {
        if (vuelo.asientosIda && vuelo.asientosIda.length > 0) {
            const claveIda = `comprados_${vuelo.origen}_${vuelo.destino}`;
            let compradosIda = JSON.parse(localStorage.getItem(claveIda)) || [];
            compradosIda = [...compradosIda, ...vuelo.asientosIda];
            localStorage.setItem(claveIda, JSON.stringify(compradosIda));
        }

        if (vuelo.asientosVuelta && vuelo.asientosVuelta.length > 0) {
            const claveVuelta = `comprados_${vuelo.destino}_${vuelo.origen}`;
            let compradosVuelta = JSON.parse(localStorage.getItem(claveVuelta)) || [];
            compradosVuelta = [...compradosVuelta, ...vuelo.asientosVuelta];
            localStorage.setItem(claveVuelta, JSON.stringify(compradosVuelta));
        }

        const nuevaReserva = {
            codigoReserva: "AL-" + Math.floor(Math.random() * 1000000), 
            emailPropietario: usuarioActivo.email,
            titulo: "Vuelo a " + (vuelo.ciudadDestino || vuelo.destino),
            tipo: vuelo.tipoVuelo || "Directo",
            pasajeros: vuelo.personas || 1,
            ruta: `${vuelo.origen} - ${vuelo.destino}`,
            fechaIda: vuelo.fechaIda || "No especificada",
            fechaVuelta: vuelo.fechaVuelta || "No especificada",
            horario: vuelo.salida || "00:00",
            horarioVuelta: vuelo.salidaVuelta || "00:00",
            asientoIda: vuelo.asientosIda || [],
            asientoVuelta: vuelo.asientosVuelta || [],
            duracion: vuelo.duracion || "N/A",
            precio: (vuelo.moneda || "USD") + " " + total_precio.textContent,
            clase: "Económica"
        };

        let reservasActuales = JSON.parse(localStorage.getItem("misReservas")) || [];
        reservasActuales.push(nuevaReserva);
        localStorage.setItem("misReservas", JSON.stringify(reservasActuales));

        localStorage.removeItem("vueloSeleccionado");
        localStorage.removeItem("asientosSeleccionados");
        localStorage.removeItem("registroPasajeros");

        window.location.href = "../pages/pago_confirmado.html"; 
    }
});
// =========================
// METODO PAGO UI
// =========================
radios.forEach((radio) => {

    radio.addEventListener("change", () => {

        mensaje_numero_tarjeta_incorrecto.style.display = "none";
        mensaje_fecha_vencimiento_incorrecta.style.display = "none";
        mensaje_cvv_incorrecto.style.display = "none";

        datos_tarjeta_oculta.style.display = "none";
        datos_transferencia_oculta.style.display = "none";

        if (radio.value === "tarjeta_credito") {
            datos_tarjeta_oculta.style.display = "flex";
        } else if (radio.value === "transferencia") {
            datos_transferencia_oculta.style.display = "block";
        }
    });
});

// =========================
// CUPONES
// =========================
button_cupon.addEventListener("click", (e) => {

    if (cuponAplicado) {
        alert("Ya aplicaste un cupón");
        return;
    }

    mensaje_cupon_invalido.style.display = "none";
    mensaje_cupon_aplicado.style.display = "none";

    let cupon = input_cupon.value.trim().toUpperCase();
    let precio = totalBaseGlobal;

    if (!validar_cupon(cupon)) {
        mensaje_cupon_invalido.style.display = "block";
        e.preventDefault();
        return;
    }

    cuponAplicado = true;

    mensaje_cupon_aplicado.style.display = "block";

    const porcentaje = Number(cupon.replace("FLYNOW", "").replace("%", ""));
    const descuento = precio * (porcentaje / 100);

    const nuevoTotal = precio - descuento;

    total_precio_chico.textContent = nuevoTotal;
    total_precio.textContent = nuevoTotal;

    input_cupon.value = "";
    input_cupon.disabled = true;
    button_cupon.disabled = true;
    button_cupon.style.cursor = "default";
});

// =========================
// VALIDACIONES
// =========================
function corroborar_pasaporte_valido_dni() {

    let cantidad = input_dni.value.length;
    let tipo = select_documento_pasaporte.value;

    if (tipo === "dni") {
        if (cantidad !== 8) {
            mensaje_dni_pasaporte_incorrecto.style.display = "flex";
            return false;
        }
    } else {
        if (cantidad !== 9 || !corroborar_pasaporte_valido(input_dni)) {
            mensaje_dni_pasaporte_incorrecto.style.display = "flex";
            return false;
        }
    }

    mensaje_dni_pasaporte_incorrecto.style.display = "none";
    return true;
}

function corroborar_numero_telefono() {

    if (input_telefono.value === "" || input_telefono.value.length === 10) {
        mensaje_telefono_incorrecto.style.display = "none";
        return true;
    }

    mensaje_telefono_incorrecto.style.display = "flex";
    return false;
}

function corroborar_pasaporte_valido(input) {

    let p = input.value;

    let letras = p.slice(0, 3).toUpperCase();
    let numeros = p.slice(3);

    return (
        /^[A-Z]{3}$/.test(letras) &&
        /^[0-9]{6}$/.test(numeros)
    );
}

function validar_cupon(cupon) {
    return ["FLYNOW10%", "FLYNOW20%", "FLYNOW30%", "FLYNOW40%", "FLYNOW50%"].includes(cupon);
}

function validar_tarjeta(numero, cvv, fecha) {

    let tarjeta_valida = true;

    mensaje_numero_tarjeta_incorrecto.style.display = "none";
    mensaje_fecha_vencimiento_incorrecta.style.display = "none";
    mensaje_cvv_incorrecto.style.display = "none";

    if (numero.length !== 16 || !/^\d+$/.test(numero)) {
        tarjeta_valida = false;
    }

    let mes = fecha.slice(0, 2);
    let barra = fecha[2];
    let anio = fecha.slice(3);

    if (mes < "01" || mes > "12" || barra !== "/" || anio.length !== 2) tarjeta_valida = false;
    if (cvv.length !== 3) tarjeta_valida = false;

    if (!tarjeta_valida) {
        mensaje_numero_tarjeta_incorrecto.style.display = "flex";
        mensaje_fecha_vencimiento_incorrecta.style.display = "flex";
        mensaje_cvv_incorrecto.style.display = "flex";
    }

    return tarjeta_valida;
}

