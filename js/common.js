document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    updateCartIcon();
});

function renderHeader() {
    const headerEl = document.getElementById('main-header');
    if (!headerEl) return;

    const currentUser = getCurrentUser();

    headerEl.innerHTML = `
        <div class="header-topbar">
            <div class="container topbar-wrapper">
                <div class="status-indicator">
                    <span class="status-dot"></span>
                    <span>Торговая площадка: ONLINE</span>
                </div>
                <div>Заказы обрабатываются мгновенно 24/7</div>
            </div>
        </div>
        <div class="header-mainbar">
            <div class="container mainbar-wrapper">
                <a href="index.html" class="brand-logo">KA!ZERR <span>STORE</span></a>
                
                <nav>
                    <ul class="nav-menu">
                        <li><a href="index.html" class="nav-link" id="nav-home">Маркет</a></li>
                        <li><a href="cart.html" class="nav-link" id="nav-cart">Корзина</a></li>
                    </ul>
                </nav>

                <div class="header-actions">
                    <a href="cart.html" class="cart-icon-btn">
                         КОРЗИНА
                        <span class="cart-badge" id="cart-count">0</span>
                    </a>
                    
                    <div class="user-session-block">
                        ${currentUser ? `
                            <div class="profile-tag">
                                <span class="welcome">Личный кабинет</span>
                                <span class="username">🎮 ${currentUser.name}</span>
                            </div>
                            <button id="logout-action" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size:0.75rem;">Выйти</button>
                        ` : `
                            <a href="auth.html" class="btn btn-primary" style="padding: 0.5rem 1.2rem; font-size:0.8rem;">Авторизация</a>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Подсвечиваем текущую страницу в меню
    const path = window.location.pathname;
    if (path.includes('cart.html')) {
        document.getElementById('nav-cart')?.classList.add('active');
    } else if (!path.includes('auth.html') && !path.includes('product.html')) {
        document.getElementById('nav-home')?.classList.add('active');
    }

    // Логика кнопки Выхода
    const logoutBtn = document.getElementById('logout-action');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('kz_current_user');
            window.location.reload();
        });
    }
}

function getCurrentUser() {
    const raw = localStorage.getItem('kz_current_user');
    return raw ? JSON.parse(raw) : null;
}

function updateCartIcon() {
    const countBadge = document.getElementById('cart-count');
    if (!countBadge) return;
    
    const raw = localStorage.getItem('kz_cart_data');
    let totalItems = 0;
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            totalItems = parsed.reduce((sum, item) => sum + item.quantity, 0);
        } catch (e) { totalItems = 0; }
    }
    countBadge.textContent = totalItems;
}