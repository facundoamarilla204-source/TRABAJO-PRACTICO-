document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('main-header');
    if (!headerPlaceholder) return;

    
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isInPagesDir ? '../' : './';
    const pagesPath = isInPagesDir ? './' : './pages/';

    
    headerPlaceholder.className = 'header';

    
    headerPlaceholder.innerHTML = `
        <div class="header__logo">
            <a href="${basePath}index.html" style="text-decoration: none;">
                <span>AeroLink</span>
            </a>
        </div>
        
        <input type="checkbox" id="menu-toggle" class="menu-checkbox">
        <label for="menu-toggle" class="menu-btn">
            <span></span>
            <span></span>
            <span></span>
        </label>

        <nav class="header__nav">
          <ul class="nav__list">
              <li><a href="${pagesPath}vuelos.html" class="nav__link">Vuelos</a></li>
              <li><a href="${pagesPath}ofertas.html" class="nav__link">Ofertas</a></li>
              <li><a href="${pagesPath}contacto.html" class="nav__link">Contacto</a></li>
              <li class="mobile-only"><a href="${pagesPath}login.html" class="nav__link">Ingresar</a></li>
              <li class="mobile-only"><a href="${pagesPath}registro.html" class="nav__link">Registrarse</a></li>
          </ul>
        </nav>

        <div class="header__actions">
            <a href="${pagesPath}login.html" class="btn btn--outline">Ingresar</a>
            <a href="${pagesPath}registro.html" class="btn btn--primary">Registrarse</a>
        </div>
    `;
});