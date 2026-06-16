document.addEventListener("DOMContentLoaded", () => {

    const email = localStorage.getItem("emailCliente");

    if (email) {
        document.getElementById("emailCliente").textContent = email;
    }

});