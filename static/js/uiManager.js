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
        this.router.setPageRenderer(this.renderPage.bind(this));
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
                    <nav class="main-nav">
                        <ul>
                            <li><a href="/" data-link>Home</a></li>
                            <li><a href="/pricing" data-link>Pricing</a></li>
                            <li><a href="/features" data-link>Features</a></li>
                            <li><a href="/contact" data-link>Contact</a></li>
                        </ul>
                    </nav>
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
            <a href="/${tool.id}" class="nav-link" data-link>
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </a>
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

    async renderPage(pageId) {
        try {
            const pageContent = await this.fetchPageContent(pageId);
            this.elements.mainContent.innerHTML = pageContent;
            await this.loadAndInitializePageScript(pageId);
            this.updateActiveNavItem(pageId);
            this.updatePageTitle(pageId);
        } catch (error) {
            console.error(`Error rendering page: ${pageId}`, error);
            this.showErrorMessage('Failed to load the page. Please try again later.');
        }
    }

    updatePageTitle(pageId) {
        const pageTitles = {
            'landing': 'Welcome',
            'dashboard': 'Dashboard',
            'formBuilder': 'Form Builder',
            'dataAnalyzer': 'Data Analyzer',
            'reportGenerator': 'Report Generator',
            'help': 'Help',
            'settings': 'Settings',
            'login': 'Login',
            'register': 'Register',
            'forgotPassword': 'Forgot Password'
        };
        document.title = `${pageTitles[pageId] || 'Page Not Found'} - HostMason`;
    }

    async fetchPageContent(pageId) {
        try {
            const response = await fetch(`/static/templates/${pageId}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.warn(`Failed to fetch template for ${pageId}:`, error);
            return this.getDefaultPageContent(pageId);
        }
    }

    getDefaultPageContent(pageId) {
        return `
            <div id="${pageId}-container">
                <h1>${this.capitalizeFirstLetter(pageId)}</h1>
                <p>Welcome to the ${pageId} page. This is default content.</p>
            </div>
        `;
    }

    async loadAndInitializePageScript(pageId) {
        try {
            const module = await import(`/static/js/pages/${pageId}.js`);
            if (module.default && typeof module.default.init === 'function') {
                await module.default.init();
            }
        } catch (error) {
            console.warn(`Failed to load or execute script for ${pageId}:`, error);
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updateActiveNavItem(pageId) {
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `/${pageId}`);
        });
    }

    updateUIForAuthState() {
        if (this.authManager.isAuthenticated()) {
            this.elements.authButtons.innerHTML = `
                <span>Welcome, ${this.authManager.user.name}</span>
                <button id="logoutBtn">Logout</button>
            `;
            this.elements.sidebar.style.display = 'block';
            document.getElementById('logoutBtn').addEventListener('click', this.authManager.logout.bind(this.authManager));
        } else {
            this.elements.authButtons.innerHTML = `
                <a href="/login" class="auth-link" data-link>Login</a>
                <a href="/register" class="auth-link" data-link>Register</a>
            `;
            this.elements.sidebar.style.display = 'none';
        }
        this.renderNavigation();
    }

    showErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.elements.mainContent.prepend(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }
}
