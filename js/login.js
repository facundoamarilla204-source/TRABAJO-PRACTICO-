document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('.formulario form');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const usuarios = JSON.parse(localStorage.getItem('listaUsuarios')) || [];

            const usuarioValido = usuarios.find(usuario => usuario.email === email && usuario.password === password);

            if (usuarioValido) {
                
                localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
                
              
                window.location.href = '../index.html';
            } else {
              
                alert('El correo o la contraseña son incorrectos.');
            }
        });
    }
});