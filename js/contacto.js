const form = document.querySelector(".custom-form");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita que recargue la página

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const motivo = document.getElementById("motivo").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validación simple
    if (!nombre || !email || !motivo || !mensaje) {
        alert("Por favor completá todos los campos.");
        return;
    }

    // Simulación de envío (TP típico)
    console.log("Consulta enviada:");
    console.log({ nombre, email, motivo, mensaje });

    // Feedback al usuario
    alert("Tu consulta fue enviada correctamente. Te contactaremos pronto.");

    // Limpia el formulario
    form.reset();
});