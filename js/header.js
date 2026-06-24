document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('main-header');
    if (!headerPlaceholder) return;

    const isInPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isInPagesDir ? '../' : './';
    const pagesPath = isInPagesDir ? './' : './pages/';

    
    const usuarioStr = localStorage.getItem('usuarioActivo');
    const usuarioActivo = usuarioStr ? JSON.parse(usuarioStr) : null;
    const isLoggedIn = usuarioActivo !== null;

    headerPlaceholder.className = 'header';

    let headerHTML = `
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
            <li><a href="${pagesPath}ofertas.html" class="nav__link">Ofertas</a></li>
            <li><a href="${pagesPath}vuelos.html" class="nav__link">Horarios</a></li>
            <li><a href="${pagesPath}contacto.html" class="nav__link">Contacto</a></li>
    `;

    if (isLoggedIn) {
        headerHTML += `
              <li class="mobile-only"><a href="${pagesPath}usuario.html" class="nav__link">Mi Perfil</a></li>
              <li class="mobile-only"><a href="#" id="btnLogoutMobile" class="nav__link">Cerrar Sesión</a></li>
        `;
    } else {
        headerHTML += `
              <li class="mobile-only"><a href="${pagesPath}login.html" class="nav__link">Ingresar</a></li>
              <li class="mobile-only"><a href="${pagesPath}registro.html" class="nav__link">Registrarse</a></li>
        `;
    }

    headerHTML += `
          </ul>
        </nav>
        <div class="header__actions">
    `;

    if (isLoggedIn) {
        headerHTML += `
            <span style="font-weight: 600; color: var(--brand-color); margin-right: 15px;">¡Hola, ${usuarioActivo.nombre}!</span>
            <a href="${pagesPath}usuario.html" class="btn btn--outline">Mi Perfil</a>
            <a href="#" id="btnLogoutDesktop" class="btn btn--primary">Cerrar Sesión</a>
        `;
    } else {
        headerHTML += `
            <a href="${pagesPath}login.html" class="btn btn--outline">Ingresar</a>
            <a href="${pagesPath}registro.html" class="btn btn--primary">Registrarse</a>
        `;
    }

    headerHTML += `
        </div>
    `;

    headerPlaceholder.innerHTML = headerHTML;

    if (isLoggedIn) {
        const handleLogout = (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioActivo'); 
            window.location.href = `${basePath}index.html`; 
        };

        const btnLogoutMobile = document.getElementById('btnLogoutMobile');
        const btnLogoutDesktop = document.getElementById('btnLogoutDesktop');

        if (btnLogoutMobile) btnLogoutMobile.addEventListener('click', handleLogout);
        if (btnLogoutDesktop) btnLogoutDesktop.addEventListener('click', handleLogout);
    }
});