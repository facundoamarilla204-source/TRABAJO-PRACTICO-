document.addEventListener('DOMContentLoaded', () => {
   
    const formRegistro = document.querySelector('.formulario form');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const nombre = document.getElementById('name').value;
            const apellido = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, intentalo de nuevo.');
                return;
            }

            
            let usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

            const usuarioExiste = usuarios.find(usuario => usuario.email === email);
            if (usuarioExiste) {
                alert('Ese correo electrónico ya está registrado.');
                return;
            }

            const nuevoUsuario = { nombre, apellido, email, password };
            usuarios.push(nuevoUsuario);
            
            localStorage.setItem('listaUsuarios', JSON.stringify(usuarios));

            alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.');
            window.location.href = 'login.html';
        });
    }
});