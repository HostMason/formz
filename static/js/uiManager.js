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
        this.mainContent.classList.toggle('expanded');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.menuToggle.querySelector('i');
        icon.classList.toggle('fa-arrow-right');
        icon.classList.toggle('fa-arrow-left');
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = '';
        this.toolManager.getAllTools().forEach(tool => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <button class="nav-btn" data-route="${tool.route}">
                    <i class="${tool.icon}"></i> <span>${tool.name}</span>
                </button>
            `;
            navList.appendChild(li);
        });
        this.addEventListenersToButtons(navList);
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
