export class UIManager {
    constructor() {
        this.elements = {};
    }

    initializeUI(router, toolManager, themeManager, authManager) {
        this.router = router;
        this.toolManager = toolManager;
        this.themeManager = themeManager;
        this.authManager = authManager;

        this.renderBasicStructure();
        this.cacheElements();
        this.attachEventListeners();
        this.renderNavigation();
        this.updateUIForAuthState();
    }

    cacheElements() {
        this.elements = {
            app: document.getElementById('app'),
            sidebar: document.querySelector('.sidebar'),
            mainContent: document.querySelector('.main-content'),
            menuToggle: document.querySelector('.menu-toggle'),
            navList: document.querySelector('.nav-list'),
            authButtons: document.querySelector('.auth-buttons'),
            themeToggle: document.getElementById('themeToggle')
        };
    }

    renderBasicStructure() {
        document.getElementById('app').innerHTML = `
            <div class="app-container">
                <header class="app-header">
                    <h1 class="company-name" id="hostMasonLogo">HostMason</h1>
                    <div class="auth-buttons"></div>
                    <button id="themeToggle">Toggle Theme</button>
                </header>
                <div class="app-body">
                    <aside class="sidebar">
                        <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu">
                            <i class="fas fa-bars"></i>
                        </button>
                        <nav class="sidebar-nav">
                            <ul class="nav-list"></ul>
                        </nav>
                    </aside>
                    <main class="main-content"></main>
                </div>
                <footer class="app-footer">
                    <p>&copy; 2023 HostMason. All rights reserved.</p>
                </footer>
            </div>
        `;
    }

    attachEventListeners() {
        this.elements.menuToggle.addEventListener('click', this.toggleSidebar.bind(this));
        this.elements.themeToggle.addEventListener('click', this.themeManager.toggleTheme.bind(this.themeManager));
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.router.navigateTo(e.target.href);
            }
        });
    }

    renderNavigation() {
        this.elements.navList.innerHTML = '';
        if (this.authManager.isAuthenticated()) {
            this.toolManager.getAllTools().forEach(tool => {
                this.elements.navList.appendChild(this.createNavItem(tool));
            });
        }
    }

    createNavItem(tool) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-btn" id="${tool.id}Btn">
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </button>
        `;
        return li;
    }

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.elements.menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    updateUIForAuthState() {
        if (this.authManager.isAuthenticated()) {
            this.elements.authButtons.innerHTML = `
                <span>Welcome, ${this.authManager.user.name}</span>
                <button id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', this.authManager.logout.bind(this.authManager));
        } else {
            this.elements.authButtons.innerHTML = `
                <a href="/login" class="auth-link" data-link>Login</a>
                <a href="/register" class="auth-link" data-link>Register</a>
            `;
        }
        this.renderNavigation();
    }
}
