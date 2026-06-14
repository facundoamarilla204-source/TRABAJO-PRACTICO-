const form = document.querySelector("form");
const input_dni = document.querySelector(".input_documento_pasaporte");
const mensaje_dni_pasaporte_incorrecto = document.querySelector(".dni_pasaporte_incorrecto");
const mensaje_telefono_incorrecto = document.querySelector(".numero_incorrecto")
const select_documento_pasaporte = document.querySelector(".select_dni_pasaporte");
const numero_telefono = document.querySelector(".input_telefono");


form.addEventListener("submit", (e) => {

    const dni_pasaporte_valido = corroborar_pasaporte_valido_dni();
    const telefono_valido = corroborar_numero_telefono();

    if (!dni_pasaporte_valido || !telefono_valido) {


        e.preventDefault();


    };



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

    if (numero_telefono.value == "" || numero_telefono.value.length == 10 ) {

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



