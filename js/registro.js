document.addEventListener('DOMContentLoaded', () => {

    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const tipo = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', tipo);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function () {
            const tipo = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', tipo);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    const formRegistro = document.querySelector('.formulario form');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nombre = document.getElementById('name').value;
            const apellido = document.getElementById('last-name').value;
            const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, intentalo de nuevo.');
                return;
            }

            if (!fechaNacimiento) {
                alert('Por favor, ingresá tu fecha de nacimiento.');
                return;
            }

            const partesFecha = fechaNacimiento.split('-');
            const fechaNac = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
            const hoy = new Date();

            if (fechaNac > hoy) {
                alert('La fecha de nacimiento es inválida.');
                return;
            }

            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
            
            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }

            if (edad < 18) {
                alert('Debes ser mayor de 18 años para crear una cuenta en AeroLink.');
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

            const usuarioExiste = usuarios.find(usuario => usuario.email === email);
            if (usuarioExiste) {
                alert('Ese correo electrónico ya está registrado.');
                return;
            }

            const nuevoUsuario = { 
                nombre, 
                apellido, 
                fechaNacimiento, 
                email, 
                password 
            };
            
            usuarios.push(nuevoUsuario);
            localStorage.setItem('listaUsuarios', JSON.stringify(usuarios));

            localStorage.setItem('usuarioActivo', JSON.stringify(nuevoUsuario));

            const volverDespuesLogin = localStorage.getItem("volverDespuesLogin");

            if (volverDespuesLogin) {
                localStorage.removeItem("volverDespuesLogin");
                alert('¡Cuenta creada con éxito!');
                window.location.href = volverDespuesLogin;
            } else {
                alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.');
                window.location.href = 'login.html';
            }
        });
    }
});