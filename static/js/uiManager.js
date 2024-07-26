import { ThemeManager } from './themeManager.js';

export class UIManager {
    constructor(router, toolManager) {
        this.router = router;
        this.toolManager = toolManager;
        this.themeManager = new ThemeManager();
        this.elements = {};
    }

    async initializeUI() {
        this.renderBasicStructure();
        this.cacheElements();
        this.attachEventListeners();
        this.renderNavigation();
        this.router.handleNavigation(this.showPage.bind(this));
        await this.showPage('landing');
        this.updateMenuToggleIcon();
    }

    cacheElements() {
        this.elements = {
            sidebar: document.querySelector('.sidebar'),
            mainContent: document.querySelector('.main-content'),
            menuToggle: document.querySelector('.menu-toggle'),
            navList: document.querySelector('.nav-list'),
            authButtons: document.querySelector('.auth-buttons')
        };
    }

    renderBasicStructure() {
        document.getElementById('app').innerHTML = `
            <div class="app-container">
                <header class="app-header">
                    <h1 class="company-name" id="hostMasonLogo">HostMason</h1>
                    <nav class="main-nav">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/pricing">Pricing</a></li>
                            <li><a href="/features">Features</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </nav>
                    <div class="auth-buttons">
                        <button id="loginBtn">Login</button>
                        <button id="registerBtn">Register</button>
                    </div>
                </header>
                <div class="app-body">
                    <aside class="sidebar">
                        <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu">
                            <i class="fas fa-arrow-right"></i>
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
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/css/main.css';
        document.head.appendChild(link);
    }

    attachEventListeners() {
        this.elements.menuToggle.addEventListener('click', this.toggleSidebar.bind(this));
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.router.navigateTo('/'));
        document.getElementById('loginBtn').addEventListener('click', () => this.router.navigateTo('/login'));
        document.getElementById('registerBtn').addEventListener('click', () => this.router.navigateTo('/register'));
    }

    renderNavigation() {
        this.elements.navList.innerHTML = '';
        if (window.app.authManager.isAuthenticated()) {
            this.toolManager.getAllTools().forEach(tool => {
                this.elements.navList.appendChild(this.createNavItem(tool));
            });
        }
        this.addEventListenersToButtons();
    }

    createNavItem(tool) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-btn" id="${tool.id}Btn" data-tool-id="${tool.id}">
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </button>
        `;
        return li;
    }

    addEventListenersToButtons() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', this.handleNavItemClick.bind(this));
        });
    }

    handleNavItemClick(e) {
        const toolId = e.currentTarget.getAttribute('data-tool-id');
        const tool = this.toolManager.getTool(toolId);
        if (tool) {
            this.router.navigateTo(`/${toolId}`);
            this.showPage(toolId);
            this.highlightActiveButton(e.currentTarget);
        } else {
            console.error(`Tool not found: ${toolId}`);
        }
    }

    highlightActiveButton(button) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.elements.menuToggle.querySelector('i');
        icon.classList.toggle('fa-arrow-right', this.elements.sidebar.classList.contains('collapsed'));
        icon.classList.toggle('fa-arrow-left', !this.elements.sidebar.classList.contains('collapsed'));
    }

    async showPage(pageId) {
        try {
            const html = await this.fetchPageContent(pageId);
            this.elements.mainContent.innerHTML = html;
            await this.loadAndInitializePageScript(pageId);
            this.updateActiveNavItem(pageId);
            this.updatePageTitle(pageId);
        } catch (error) {
            console.error(`Error loading page: ${pageId}`, error);
            this.showErrorPage(pageId);
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

    showErrorPage(pageId) {
        this.elements.mainContent.innerHTML = `
            <h1>Error 404: Page Not Found</h1>
            <p>The requested page "${pageId}" could not be found.</p>
        `;
    }

    updateActiveNavItem(pageId) {
        document.querySelectorAll('.nav-btn').forEach(item => {
            item.classList.toggle('active', item.id === `${pageId}Btn`);
        });
    }

    updateUIForAuthState() {
        if (window.app.authManager.isAuthenticated()) {
            this.elements.authButtons.innerHTML = `
                <span>Welcome, ${window.app.authManager.user.name}</span>
                <button id="logoutBtn">Logout</button>
            `;
            this.elements.sidebar.style.display = 'block';
            this.renderNavigation();
        } else {
            this.elements.authButtons.innerHTML = `
                <button id="loginBtn">Login</button>
                <button id="registerBtn">Register</button>
            `;
            this.elements.sidebar.style.display = 'none';
        }
        this.attachEventListeners();
    }
}
