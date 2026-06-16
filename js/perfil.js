document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPersonales();
    cargarReservasDesdeStorage();
});

function calcularEdad(fechaString) {
    if (!fechaString) return null;
    
    const hoy = new Date();
    const fechaNac = new Date(fechaString);
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
    
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    
    return edad;
}

function cargarDatosPersonales() {
    const usuarioActivoStorage = localStorage.getItem('usuarioActivo');

    if (usuarioActivoStorage) {
        const usuario = JSON.parse(usuarioActivoStorage);

        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
        
        document.getElementById('perfil-nombre').textContent = nombreCompleto;
        document.getElementById('perfil-email').textContent = usuario.email;
        
        let textoEdad = "No especificada";
        if (usuario.fechaNacimiento) {
            textoEdad = `${calcularEdad(usuario.fechaNacimiento)} años`;
        } else if (usuario.edad) {
            textoEdad = `${usuario.edad} años`; 
        }
        document.getElementById('perfil-edad').textContent = textoEdad;
        
        document.getElementById('perfil-telefono').textContent = usuario.telefono || "No especificado";
        document.getElementById('perfil-direccion').textContent = usuario.direccion || "No especificado";

    } else {
        console.warn("No hay usuario activo logueado.");
    }
}

function cargarReservasDesdeStorage() {
    const contenedor = document.getElementById("contenedor-reservas");
    contenedor.innerHTML = ""; 

    const reservasStorage = localStorage.getItem("misReservas");

    if (reservasStorage) {
        const listaReservas = JSON.parse(reservasStorage);

        if (listaReservas.length === 0) {
            contenedor.innerHTML = "<p>No tenés reservas realizadas actualmente.</p>";
            return;
        }

        listaReservas.forEach(reserva => {
            const li = document.createElement("li");
            
            li.innerHTML = `
                <details>
                    <summary>${reserva.titulo}</summary>
                    <ul class="detalles-reserva">
                        <li>Tipo: ${reserva.tipo}</li>
                        <li>Cantidad de Pasajeros: ${reserva.pasajeros}</li>
                        <li>Ruta: ${reserva.ruta}</li>
                        <li>Horario de vuelo: ${reserva.horario}</li>
                        <li>Duración: ${reserva.duracion}</li>
                        <li>Precio: ${reserva.precio}</li>
                        <li>Clase: ${reserva.clase}</li>
                        <li>Asiento Ida: ${reserva.asientoIda}</li>
                        <li>Fecha de vuelta: ${reserva.fechaVuelta || "No aplica"}</li>
                        <li>Horario de vuelo: ${reserva.horarioVuelta || "--:--"}</li>
                        <li>Asiento Vuelta: ${reserva.asientoVuelta || "No aplica"}</li>
                    </ul>
                </details>
            `;
            contenedor.appendChild(li);
        });
    } else {
        contenedor.innerHTML = "<p>Todavía no realizaste ninguna reserva de vuelo.</p>";
    }
}