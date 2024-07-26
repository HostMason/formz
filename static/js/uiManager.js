import { ThemeManager } from './themeManager.js';

export class UIManager {
    constructor(router, toolManager) {
        this.sidebar = null;
        this.mainContent = null;
        this.menuToggle = null;
        this.toolManager = toolManager;
        this.router = router;
        this.themeManager = new ThemeManager();
    }

    async initializeUI() {
        this.renderBasicStructure();
        this.cacheElements();
        this.attachEventListeners();
        this.renderNavigation();
        this.router.handleNavigation((pageId) => this.showPage(pageId));
        await this.showPage('landing');
        this.updateMenuToggleIcon();
    }

    cacheElements() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
    }

    renderBasicStructure() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
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
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.router.navigateTo('/'));
        document.getElementById('loginBtn').addEventListener('click', () => this.router.navigateTo('/login'));
        document.getElementById('registerBtn').addEventListener('click', () => this.router.navigateTo('/register'));
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = '';

        if (window.app.authManager.isAuthenticated()) {
            this.toolManager.getAllTools().forEach(tool => {
                navList.appendChild(this.createNavItem(tool));
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
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
        });
    }

    handleNavItemClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const toolId = button.getAttribute('data-tool-id');
        const tool = this.toolManager.getTool(toolId);
        
        if (tool) {
            this.router.navigateTo(`/${toolId}`);
            this.showPage(toolId);
            this.highlightActiveButton(button);
        } else {
            console.error(`Tool not found: ${toolId}`);
        }
    }

    highlightActiveButton(button) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.menuToggle.querySelector('i');
        if (this.sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-arrow-left');
            icon.classList.add('fa-arrow-right');
        } else {
            icon.classList.remove('fa-arrow-right');
            icon.classList.add('fa-arrow-left');
        }
    }

    async showPage(pageId) {
        try {
            const html = await this.fetchPageContent(pageId);
            this.mainContent.innerHTML = html;
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
                <p>Welcome to the ${pageId} page. This is a default content.</p>
            </div>
        `;
    }

    async loadAndInitializePageScript(pageId) {
        const scriptPath = `/static/js/pages/${pageId}.js`;
        try {
            const module = await import(scriptPath);
            if (module.default && typeof module.default.init === 'function') {
                await module.default.init();
            }
        } catch (scriptError) {
            console.warn(`Failed to load or execute script for ${pageId}:`, scriptError);
            this.renderBasicPageContent(pageId);
        }
    }

    renderBasicPageContent(pageId) {
        const pageContent = `
            <h1>${this.capitalizeFirstLetter(pageId)}</h1>
            <p>Welcome to the ${pageId} page. This is a placeholder content.</p>
        `;
        this.mainContent.innerHTML = pageContent;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    showErrorPage(pageId) {
        this.mainContent.innerHTML = `
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
        const authButtons = document.querySelector('.auth-buttons');
        const sidebar = document.querySelector('.sidebar');
        
        if (window.app.authManager.isAuthenticated()) {
            authButtons.innerHTML = `
                <span>Welcome, ${window.app.authManager.user.name}</span>
                <button id="logoutBtn">Logout</button>
            `;
            sidebar.style.display = 'block';
            this.renderNavigation();
        } else {
            authButtons.innerHTML = `
                <button id="loginBtn">Login</button>
                <button id="registerBtn">Register</button>
            `;
            sidebar.style.display = 'none';
        }
        
        this.attachEventListeners();
    }
}
