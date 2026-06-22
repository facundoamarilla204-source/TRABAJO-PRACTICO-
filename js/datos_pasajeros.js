document.addEventListener("DOMContentLoaded", () => {
    
    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
    if (!vuelo) {
        window.location.href = "../index.html";
        return;
    }

    const cantidadPasajeros = Number(vuelo.personas) || 1;
    const contenedorFormularios = document.getElementById("formulariosDinamicos");
    const formPrincipal = document.getElementById("formPasajeros");

    
    let htmlFormularios = "";

    for (let i = 1; i <= cantidadPasajeros; i++) {
        htmlFormularios += `
            <div class="card-pasajero">
                <h3><i class="fa-solid fa-user"></i> Pasajero ${i}</h3>
                
                <div class="grid-inputs">
                    <div class="grupo-input">
                        <label for="nombre-${i}">Nombre</label>
                        <input type="text" id="nombre-${i}" required placeholder="Tal como figura en el DNI">
                    </div>
                    
                    <div class="grupo-input">
                        <label for="apellido-${i}">Apellido</label>
                        <input type="text" id="apellido-${i}" required>
                    </div>

                    <div class="grupo-input">
                        <label for="dni-${i}">Número de Documento (DNI o Pasaporte)</label>
                        <input type="text" id="dni-${i}" required>
                    </div>

                    <div class="grupo-input">
                        <label for="telefono-${i}">Teléfono</label>
                        <input type="tel" id="telefono-${i}" required>
                    </div>

                    <div class="grupo-input" style="grid-column: 1 / -1;">
                        <label for="email-${i}">Correo electrónico</label>
                        <input type="email" id="email-${i}" required>
                    </div>
                </div>
            </div>
        `;
    }

    contenedorFormularios.innerHTML = htmlFormularios;

    formPrincipal.addEventListener("submit", (e) => {
        e.preventDefault();

        const registroPasajeros = [];

        
        for (let i = 1; i <= cantidadPasajeros; i++) {
            const pasajero = {
                id: i,
                nombre: document.getElementById(`nombre-${i}`).value,
                apellido: document.getElementById(`apellido-${i}`).value,
                dni: document.getElementById(`dni-${i}`).value,
                telefono: document.getElementById(`telefono-${i}`).value,
                email: document.getElementById(`email-${i}`).value,
            };
            registroPasajeros.push(pasajero);
        }

        localStorage.setItem("registroPasajeros", JSON.stringify(registroPasajeros));

        window.location.href = "./pago.html";
    });
});