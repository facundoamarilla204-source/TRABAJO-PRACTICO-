document.addEventListener("DOMContentLoaded", () => {
    
    const elementoFecha = document.querySelector(".fecha-barra p");

    if (elementoFecha) {
        const fechaHoy = new Date();

        const opcionesDeFormato = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };

        const fechaFormateada = fechaHoy.toLocaleDateString('es-AR', opcionesDeFormato);
        
       
        elementoFecha.textContent = fechaFormateada;
    }
});