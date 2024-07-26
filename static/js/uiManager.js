import { ToolManager, Tool } from './toolManager.js';
import { ThemeManager } from './themeManager.js';

export class UIManager {
    constructor(router) {
        this.sidebar = null;
        this.mainContent = null;
        this.menuToggle = null;
        this.toolManager = new ToolManager();
        this.router = router;
        this.themeManager = new ThemeManager();
    }

    async initializeUI() {
        this.renderBasicStructure();
        this.cacheElements();
        await this.initializeTools();
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

    async initializeTools() {
        const toolbox = new Tool('toolbox', 'Toolbox', 'fas fa-toolbox', () => this.showPage('toolbox'));
        const help = new Tool('help', 'Help', 'fas fa-question-circle', () => this.showPage('help'));
        const settings = new Tool('settings', 'Settings', 'fas fa-cog', () => this.showPage('settings'));

        this.toolManager.addTool(toolbox);
        this.toolManager.addTool(help);
        this.toolManager.addTool(settings);
    }

    renderBasicStructure() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="app-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <h1 class="company-name" id="hostMasonLogo">HostMason</h1>
                    </div>
                    <nav class="sidebar-nav">
                        <ul class="nav-list"></ul>
                    </nav>
                </aside>
                <main class="main-content"></main>
            </div>
        `;
    }

    attachEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.showLandingPage());
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = '';

        this.toolManager.getAllTools().forEach(tool => {
            navList.appendChild(this.createNavItem(tool));
        });

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

    showLandingPage() {
        this.showPage('landing');
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
            'toolbox': 'Toolbox',
            'help': 'Help',
            'settings': 'Settings'
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
        const scriptPath = `/static/js/tools/${pageId}.js`;
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
}
