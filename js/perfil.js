document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPersonales();
    cargarReservasDesdeStorage();
    inicializarSelectsPreferencias();
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

        if (document.getElementById('select-asiento')) {
            document.getElementById('select-asiento').value = usuario.asientoPreferido || "No especificado";
            document.getElementById('select-comida').value = usuario.comidaEspecial || "No especificada";
            document.getElementById('select-actividades').value = usuario.actividadesInteres || "No especificadas";
            document.getElementById('select-transporte').value = usuario.transporteAeropuerto || "No especificado";
        }

    } else {
        console.warn("No hay usuario activo logueado.");
    }
}

function cargarReservasDesdeStorage() {
    const contenedor = document.getElementById("contenedor-reservas");
    contenedor.innerHTML = ""; 

    const reservasStorage = localStorage.getItem("misReservas");
    const usuarioActivoStorage = localStorage.getItem("usuarioActivo");

    if (reservasStorage && usuarioActivoStorage) {
        const todasLasReservas = JSON.parse(reservasStorage);
        const usuarioActivo = JSON.parse(usuarioActivoStorage);

        // FILTRO: Guardamos solo las reservas que le pertenecen al usuario logueado
        const misReservasPropias = todasLasReservas.filter(reserva => reserva.emailPropietario === usuarioActivo.email);

        if (misReservasPropias.length === 0) {
            contenedor.innerHTML = "<p>No tenés reservas realizadas actualmente.</p>";
            return;
        }

        misReservasPropias.forEach(reserva => {
            const li = document.createElement("li");
            
            li.innerHTML = `
                <details>
                    <summary>${reserva.titulo}</summary>
                    <div class="contenedor-reserva-flex">
                        <ul class="detalles-reserva">
                            <li>Tipo: ${reserva.tipo}</li>
                            <li>Cantidad de Pasajeros: ${reserva.pasajeros}</li>
                            <li>Ruta: ${reserva.ruta}</li>
                            <li>Fecha de ida: ${reserva.fechaIda}</li>
                            <li>Fecha de vuelta: ${reserva.fechaVuelta}</li>
                            <li>Horario de vuelo-ida: ${reserva.horario}</li>
                            <li>Horario de vuelo-vuelta: ${reserva.horarioVuelta}</li>
                            <li>Asientos de Ida: ${reserva.asientoIda}</li>
                            <li>Asientos de Vuelta: ${reserva.asientoVuelta}</li>
                            <li>Duración: ${reserva.duracion}</li>
                            <li>Precio: ${reserva.precio}</li>
                            <li>Clase: ${reserva.clase}</li>   
                        </ul>
                        <div class="contenedor-acciones-reserva">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${reserva.codigoReserva || 'AeroLink'}" alt="QR de Reserva" class="qr-reserva">
                            <p class="texto-codigo-reserva">Reserva: ${reserva.codigoReserva || 'N/A'}</p>
                            <button onclick="cancelarReserva('${reserva.codigoReserva}')" class="btn-cancelar-reserva">Cancelar Reserva</button>
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

function inicializarSelectsPreferencias() {
    const mapeoSelects = [
        { id: 'select-asiento', campo: 'asientoPreferido' },
        { id: 'select-comida', campo: 'comidaEspecial' },
        { id: 'select-actividades', campo: 'actividadesInteres' },
        { id: 'select-transporte', campo: 'transporteAeropuerto' }
    ];

    mapeoSelects.forEach(item => {
        const elementoSelect = document.getElementById(item.id);
        if (elementoSelect) {
            elementoSelect.addEventListener('change', (e) => {
                guardarPreferencia(item.campo, e.target.value);
            });
        }
    });
}

function guardarPreferencia(campo, nuevoValor) {
    const usuarioStorage = localStorage.getItem('usuarioActivo');
    if (!usuarioStorage) return;

    let usuario = JSON.parse(usuarioStorage);
    let emailViejo = usuario.email; 

    usuario[campo] = nuevoValor;
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    
    let listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];
    let indiceUsuario = listaUsuarios.findIndex(u => u.email === emailViejo);
    
    if (indiceUsuario !== -1) {
        listaUsuarios[indiceUsuario] = usuario;
        localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios));
    }
}

function cancelarReserva(codigoReserva) {
    if (!codigoReserva || codigoReserva === 'undefined') {
        alert("Esta reserva no tiene un código válido y no puede ser cancelada.");
        return;
    }

    const usuarioStorage = localStorage.getItem('usuarioActivo');
    if (!usuarioStorage) {
        alert("Error: No se encontró la sesión activa.");
        return;
    }

    const usuario = JSON.parse(usuarioStorage);
    const contrasenaIngresada = prompt("Por seguridad, ingresá tu contraseña para confirmar la cancelación de la reserva:");

    if (contrasenaIngresada === null) {
        return;
    }

    if (contrasenaIngresada === usuario.password) {
        let reservasActuales = JSON.parse(localStorage.getItem("misReservas")) || [];
        reservasActuales = reservasActuales.filter(reserva => reserva.codigoReserva !== codigoReserva);
        localStorage.setItem("misReservas", JSON.stringify(reservasActuales));
        
        cargarReservasDesdeStorage();
        alert("La reserva ha sido cancelada exitosamente.");
    } else {
        alert("Contraseña incorrecta. La reserva no ha sido cancelada.");
    }
}