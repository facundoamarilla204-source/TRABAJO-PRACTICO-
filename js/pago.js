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

document.addEventListener("DOMContentLoaded", () => {

    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    const asiento = localStorage.getItem("asientoSeleccionado");

    if (!vuelo) return;

    document.getElementById("origenIdaCheckout").textContent = `${vuelo.origen} (${vuelo.ciudadOrigen})`;
    document.getElementById("destinoIdaCheckout").textContent = `${vuelo.destino} (${vuelo.ciudadDestino})`;
    document.getElementById("horarioIdaCheckout").textContent = `${vuelo.salida} - ${vuelo.llegada}`;
    document.getElementById("origenVueltaCheckout").textContent = `${vuelo.destino} (${vuelo.ciudadDestino})`;
    document.getElementById("destinoVueltaCheckout").textContent = `${vuelo.origen} (${vuelo.ciudadOrigen})`;
    document.getElementById("horarioVueltaCheckout").textContent = `${vuelo.salidaVuelta} - ${vuelo.llegadaVuelta}`;
    document.getElementById("totalCheckout").textContent = vuelo.total;
    document.getElementById("totalCheckoutGrande").textContent = vuelo.total;
    document.getElementById("asientoCheckout").textContent = asiento || "Sin seleccionar";

    let totalFinal = parseFloat(vuelo.total);
    if (asiento && asiento !== "") {
        totalFinal += 25;
    }

    
    document.getElementById("totalCheckout").textContent = totalFinal;
    document.getElementById("totalCheckoutGrande").textContent = totalFinal;

   
    if (total_precio_chico) total_precio_chico.textContent = totalFinal;
    if (total_precio) total_precio.textContent = totalFinal;

});

input_tarjeta.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16);   
});

input_cvv.addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/\D/g, "")  
    .slice(0, 3 );         
});

input_telefono.addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/\D/g, "")   
});

input_fecha_vencimiento.addEventListener("input", (e) => {  
  let value = e.target.value;

  // 1. dejar solo números
  value = value.replace(/\D/g, "");

  // 2. limitar a 4 dígitos (MMYY)
  value = value.slice(0, 4);

  // 3. agregar "/"
  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

   e.target.value = value; 
    
});


form.addEventListener("submit", (e) => {

    localStorage.setItem("emailCliente", input_email.value);
    const numero_tarjeta = input_tarjeta.value;
    const cvv = input_cvv.value;
    const fecha_vencimiento = input_fecha_vencimiento.value;
    const dni_pasaporte_valido = corroborar_pasaporte_valido_dni();
    const telefono_valido = corroborar_numero_telefono();

    const metodo_pago_seleccionado = document.querySelector('input[name="metodo_pago"]:checked');

    let tarjeta_valida = true;

    if (metodo_pago_seleccionado.value === "tarjeta_credito") {
        tarjeta_valida = validar_tarjeta(
            numero_tarjeta,
            cvv,
            fecha_vencimiento
        );
    }

    if (!dni_pasaporte_valido || !telefono_valido || !tarjeta_valida) {


        e.preventDefault();


    };



})

radios.forEach((radio) => {

    

  radio.addEventListener("change", () => {

        mensaje_numero_tarjeta_incorrecto.style.display = "none";
        mensaje_fecha_vencimiento_incorrecta.style.display = "none";
        mensaje_cvv_incorrecto.style.display = "none";

        datos_tarjeta_oculta.style.display = "none";
        datos_transferencia_oculta.style.display = "none";

        if (radio.value === "tarjeta_credito") {
            datos_tarjeta_oculta.style.display = "flex";
        }

        if (radio.value === "transferencia") {
            datos_transferencia_oculta.style.display = "block";
        }

    });

})

button_cupon.addEventListener("click", (e) => {

    mensaje_cupon_invalido.style.display = "none";
    mensaje_cupon_aplicado.style.display = "none";

    let cupon = input_cupon.value;
    let precio = parseInt(total_precio_chico.textContent);
    let descuento = 0;
    let precio_con_descuento = 0;

    if(!validar_cupon(cupon)) {

        mensaje_cupon_invalido.style.display = "block";
        e.preventDefault();


    } else {

        mensaje_cupon_aplicado.style.display = "block";

        if(cupon === "FLYNOW10%") {

            descuento = (precio*10) / 100;
            precio_con_descuento = precio - descuento;
            total_precio_chico.textContent = precio_con_descuento;
            total_precio.textContent = precio_con_descuento;
            input_cupon.value = "";
            return;

        }

          if(cupon === "FLYNOW20%") {

            descuento = (precio*20) / 100;
            precio_con_descuento = precio - descuento;
            total_precio_chico.textContent = precio_con_descuento;
            total_precio.textContent = precio_con_descuento;
            input_cupon.value = "";
            return;
            
        }

          if(cupon === "FLYNOW30%") {
            descuento = (precio*30) / 100;
            precio_con_descuento = precio - descuento;
            total_precio_chico.textContent = precio_con_descuento;
            total_precio.textContent = precio_con_descuento;
            input_cupon.value = "";
            return;
            
        }

          if(cupon === "FLYNOW40%") {
            descuento = (precio*40) / 100;
            precio_con_descuento = precio - descuento;
            total_precio_chico.textContent = precio_con_descuento;
            total_precio.textContent = precio_con_descuento;
            input_cupon.value = "";
            return;
            
        }

          if(cupon === "FLYNOW50%") {
            descuento = (precio*50) / 100;
            precio_con_descuento = precio - descuento;
            total_precio_chico.textContent = precio_con_descuento;
            total_precio.textContent = precio_con_descuento;
            input_cupon.value = "";
            return;
            
        }

        


    }







})

function corroborar_pasaporte_valido_dni () {

    let cantidad_caracteres_ingresados = input_dni.value.length;
    let tipo_documento = select_documento_pasaporte.value;

    if (tipo_documento === "dni") {  //En caso de que sea documento tomamos esta verificación


        if (cantidad_caracteres_ingresados !== 8) {


            mensaje_dni_pasaporte_incorrecto.style.display = "flex";
            
            return false;

        } else {

            mensaje_dni_pasaporte_incorrecto.style.display = "none"; 
            return true;

        } 



    } else { //En caso de que sea pasaporte tomamos esta verificación


        if (cantidad_caracteres_ingresados !== 9 || !corroborar_pasaporte_valido(input_dni)) {


            mensaje_dni_pasaporte_incorrecto.style.display = "flex";
            return false;


        } else {

            mensaje_dni_pasaporte_incorrecto.style.display = "none";
            return true;

        }



    }



}

function corroborar_numero_telefono() {

    if (input_telefono.value == "" || input_telefono.value.length == 10 ) {

        mensaje_telefono_incorrecto.style.display = "none";
        return true;


    } else {

        mensaje_telefono_incorrecto.style.display = "flex";
        return false;


    }



}

function corroborar_pasaporte_valido(input_dni) {

    let pasaporte = input_dni.value;
    let letra_uno = pasaporte[0].toUpperCase();
    let letra_dos = pasaporte[1].toUpperCase();
    let letra_tres = pasaporte[2].toUpperCase();
    let numeros = pasaporte.slice(3);

    if (
        (letra_uno >= "A" && letra_uno <= "Z") && 
        (letra_dos >= "A" && letra_dos <= "Z") && 
        (letra_tres >= "A" && letra_tres <= "Z") &&
        (numeros[0] >= "0" && numeros[0] <= "9") &&
        (numeros[1] >= "0" && numeros[1] <= "9") &&
        (numeros[2] >= "0" && numeros[2] <= "9") &&
        (numeros[3] >= "0" && numeros[3] <= "9") &&
        (numeros[4] >= "0" && numeros[4] <= "9") &&
        (numeros[5] >= "0" && numeros[5] <= "9")) 
        
        
        {

        return true;

    } else {

        return false;
    }


}

function validar_cupon(cupon) {

      if(cupon === "FLYNOW10%") {
        return true;
    }

      if(cupon === "FLYNOW20%") {
        return true;
    }

      if(cupon === "FLYNOW30%") {
        return true;
    }

      if(cupon === "FLYNOW40%") {
        return true;
    }

      if(cupon === "FLYNOW50%") {
        return true;
    }

    return false;

}

function validar_tarjeta(numero_tarjeta, cvv, fecha_vencimiento) {

    let esValida = true;

    mensaje_numero_tarjeta_incorrecto.style.display = "none";
    mensaje_fecha_vencimiento_incorrecta.style.display = "none";
    mensaje_cvv_incorrecto.style.display = "none";

    let mes = fecha_vencimiento.slice(0, 2);
    let barra = fecha_vencimiento[2];
    let anio = fecha_vencimiento.slice(3);

    if (numero_tarjeta.length !== 16) {
        mensaje_numero_tarjeta_incorrecto.style.display = "flex";
        esValida = false;
    }

    for (let i = 0; i < numero_tarjeta.length; i++) {

        if (numero_tarjeta[i] < "0" || numero_tarjeta[i] > "9") {
            mensaje_numero_tarjeta_incorrecto.style.display = "flex";
            esValida = false;
        }

    }

    if (mes < "01" || mes > "12" || barra !== "/" || anio.length !== 2) {
        mensaje_fecha_vencimiento_incorrecta.style.display = "flex";
        esValida = false;
    }

    if (cvv.length !== 3) {
        mensaje_cvv_incorrecto.style.display = "flex";
        esValida = false;
    }

    return esValida;
}



