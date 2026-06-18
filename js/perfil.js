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

        document.getElementById('perfil-asiento').textContent = usuario.asientoPreferido || "No especificado";
        document.getElementById('perfil-comida').textContent = usuario.comidaEspecial || "No especificada";
        document.getElementById('perfil-actividades').textContent = usuario.actividadesInteres || "No especificadas";
        document.getElementById('perfil-transporte').textContent = usuario.transporteAeropuerto || "No especificado";

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
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; padding: 10px 0;">
                        <ul class="detalles-reserva" style="flex: 1; min-width: 250px;">
                            <li>Tipo: ${reserva.tipo}</li>
                            <li>Cantidad de Pasajeros: ${reserva.pasajeros}</li>
                            <li>Ruta: ${reserva.ruta}</li>
                            <li>Horario de vuelo: ${reserva.horario}</li>
                            <li>Duración: ${reserva.duracion}</li>
                            <li>Precio: ${reserva.precio}</li>
                            <li>Clase: ${reserva.clase}</li>
                            <li>Asiento Ida: ${reserva.asientoIda}</li>
                            <li>Fecha de vuelta: ${reserva.fechaVuelta}</li>
                            <li>Horario de vuelo: ${reserva.horarioVuelta}</li>
                            <li>Asiento Vuelta: ${reserva.asientoVuelta}</li>
                        </ul>
                        <div style="text-align: center; margin: 15px auto;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${reserva.codigoReserva || 'AeroLink'}" alt="QR de Reserva" style="border-radius: 8px;">
                            <p style="font-size: 0.85em; margin-top: 8px; font-weight: bold; color: #333;">Reserva: ${reserva.codigoReserva || 'N/A'}</p>
                        </div>
                    </div>
                </details>
            `;
            contenedor.appendChild(li);
        });
    } else {
        contenedor.innerHTML = "<p>Todavía no realizaste ninguna reserva de vuelo.</p>";
    }
}

function editarDato(evento, campo) {
    evento.preventDefault();

    const usuarioStorage = localStorage.getItem('usuarioActivo');
    if (!usuarioStorage) return;

    let usuario = JSON.parse(usuarioStorage);
    
    let emailViejo = usuario.email; 

    let valorActual = usuario[campo] || "";

    let nuevoValor = prompt(`Ingresá tu nuevo/a ${campo}:`, valorActual);

    if (nuevoValor !== null && nuevoValor.trim() !== "") {
        
        usuario[campo] = nuevoValor.trim();
        
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
        
        let listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];
        
        let indiceUsuario = listaUsuarios.findIndex(u => u.email === emailViejo);
        
        if (indiceUsuario !== -1) {
            listaUsuarios[indiceUsuario] = usuario;
            localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios));
        }

        cargarDatosPersonales();
    }
}