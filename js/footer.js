document.addEventListener('DOMContentLoaded', () => {
    const footerPlaceholder = document.getElementById('main-footer');
    if (!footerPlaceholder) return;

    const isInPagesDir = window.location.pathname.includes('/pages/');
    const pagesPath = isInPagesDir ? './' : './pages/';

    footerPlaceholder.className = 'footer';

    footerPlaceholder.innerHTML = `
        <div class="footer__container">
          <div class="footer__grid">
            <div class="footer__col">
              <h3 class="footer__logo">AeroLink</h3>
              <p class="footer__desc">Conectando tus destinos al mejor precio, con la seguridad y comodidad que merecés en cada vuelo.</p>
              <div class="footer__socials">
                <a href="https://www.instagram.com/" class="social-icon" target="_blank">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="https://x.com/?lang=es" class="social-icon" target="_blank">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="https://web.facebook.com/?locale=es_LA&_rdc=1&_rdr#" class="social-icon" target="_blank">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
            
            <div class="footer__col">
              <h4 class="footer__title">Navegación</h4>
              <ul class="footer__list">
                <li><a href="${pagesPath}vuelos.html" class="footer__link">Buscar Vuelos</a></li>
                <li><a href="${pagesPath}ofertas.html" class="footer__link">Ofertas de la Semana</a></li>
                <li><a href="${pagesPath}nosotros.html" class="footer__link">Sobre Nosotros</a></li>
              </ul>
            </div>
            
            <div class="footer__col">
              <h4 class="footer__title">Soporte y Ayuda</h4>
              <ul class="footer__list">
                <li><a href="${pagesPath}faq.html" class="footer__link">Centro de Ayuda (FAQ)</a></li>
                <li><a href="${pagesPath}contacto.html" class="footer__link">Formulario de Contacto</a></li>
                <li><a href="${pagesPath}faq.html" class="footer__link">Política de Equipaje</a></li>
                <li><a href="${pagesPath}faq.html" class="footer__link">Viajar con Mascotas</a></li>
              </ul>
            </div>
            
            <div class="footer__col">
              <h4 class="footer__title">Legal</h4>
              <ul class="footer__list">
                <li><a href="${pagesPath}terminosycondiciones.html" class="footer__link">Términos y Condiciones</a></li>
                <li><a href="${pagesPath}terminosycondiciones.html" class="footer__link">Políticas de Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer__bottom">
            <p>&copy; 2026 AeroLink. Todos los derechos reservados. Proyecto Académico.</p>
          </div>
        </div>
    `;
});