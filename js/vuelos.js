const form = document.querySelector(".filtros");
const vuelos = document.querySelectorAll(".vuelo-item");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const origen = document.getElementById("origen").value.toLowerCase().trim();
    const destino = document.getElementById("destino").value.toLowerCase().trim();

    vuelos.forEach(vuelo => {
        const texto = vuelo.textContent.toLowerCase();

        const matchOrigen = origen === "" || texto.includes(origen);
        const matchDestino = destino === "" || texto.includes(destino);

        if (matchOrigen && matchDestino) {
            vuelo.style.display = "flex";
        } else {
            vuelo.style.display = "none";
        }
    });
});

const reset = document.getElementById("reset");

reset.addEventListener("click", () => {
    form.reset();

    vuelos.forEach(vuelo => {
        vuelo.style.display = "flex";
    });
});