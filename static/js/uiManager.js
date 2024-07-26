import { ToolManager } from './toolManager.js';

export class UIManager {
    constructor() {
        this.sidebar = null;
        this.mainContent = null;
        this.menuToggle = null;
        this.toolManager = new ToolManager();
    }

    initializeUI() {
        this.renderBasicStructure();
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.attachEventListeners();
        this.renderNavigation();
        this.showLandingPage(); // Show landing page by default
        this.updateMenuToggleIcon(); // Set initial icon state
    }

    showLandingPage() {
        import('./components/LandingPage.js').then(module => {
            const landingPage = new module.default();
            this.mainContent.innerHTML = landingPage.render();
            if (landingPage.afterRender) {
                landingPage.afterRender();
            }
        });
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
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.menuToggle.querySelector('i');
        if (this.sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = '';
        const tools = this.toolManager.getAllTools();
        
        // Render all tools except settings
        tools.filter(tool => tool.name !== 'Settings').forEach(tool => {
            const li = this.createNavItem(tool);
            navList.appendChild(li);
        });

        // Render settings button at the bottom
        const settingsSection = document.createElement('div');
        settingsSection.className = 'settings-section';
        const settingsTool = tools.find(tool => tool.name === 'Settings');
        if (settingsTool) {
            const settingsLi = this.createNavItem(settingsTool);
            settingsSection.appendChild(settingsLi);
        }
        this.sidebar.appendChild(settingsSection);

        this.addEventListenersToButtons(this.sidebar);
    }

    createNavItem(tool) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-btn" data-route="${tool.route}">
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </button>
        `;
        
        if (tool.name === 'Form Builder') {
            const subMenu = document.createElement('ul');
            subMenu.className = 'submenu';
            subMenu.innerHTML = `
                <li><button class="nav-btn" data-route="/form-builder/load">Load Form</button></li>
                <li><button class="nav-btn" data-route="/form-builder/save">Save Form</button></li>
                <li><button class="nav-btn" data-route="/form-builder/delete">Delete Form</button></li>
            `;
            li.appendChild(subMenu);
        }
        
        return li;
    }

    addEventListenersToButtons(element) {
        element.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
        });
    }

    handleNavItemClick(e) {
        e.preventDefault();
        const route = e.currentTarget.getAttribute('data-route');
        if (route === '/help') {
            this.showPage('help');
        } else if (route === '/settings') {
            this.showPage('settings');
        } else {
            // Here you would typically use your router to navigate
            console.log(`Navigating to: ${route}`);
        }
    }

    addEventListenersToButtons(element) {
        element.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
        });
    }

    handleNavItemClick(e) {
        e.preventDefault();
        const route = e.currentTarget.getAttribute('data-route');
        // Here you would typically use your router to navigate
        console.log(`Navigating to: ${route}`);
    }
}
