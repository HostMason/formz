import { ToolManager } from './toolManager.js';

export class UISystem {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.toolManager = new ToolManager();
        this.initializeTools();
        this.initializeEventListeners();
    }

    async initializeTools() {
        await this.toolManager.initializeTools();
        this.renderNavigation();
    }

    initializeEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.showPage('landing'));
        this.addEventListenersToButtons(this.sidebar);
        this.addEventListenersToButtons(this.sidebar);
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = ''; // Clear existing navigation

        this.toolManager.getAllTools().forEach(tool => {
            navList.appendChild(this.createNavItem(tool));
        });

        // Add event listeners to all buttons, including those in submenus
        this.addEventListenersToButtons(navList);
    }

    addEventListenersToButtons(element) {
        element.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
        });

        // Recursively add event listeners to buttons in submenus
        element.querySelectorAll('.submenu').forEach(submenu => {
            this.addEventListenersToButtons(submenu);
        });
    }

    createNavItem(tool) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-btn" id="${tool.id}Btn">
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </button>
        `;
        
        if (tool.subTools && tool.subTools.length > 0) {
            const subMenu = document.createElement('ul');
            subMenu.className = 'submenu';
            tool.subTools.forEach(subTool => {
                subMenu.appendChild(this.createNavItem(subTool));
            });
            li.appendChild(subMenu);
        }
        
        return li;
    }

    handleNavItemClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const toolId = button.id.replace('Btn', '');
        const tool = this.toolManager.getTool(toolId);
        
        if (tool) {
            if (tool.subTools && tool.subTools.length > 0) {
                this.toggleSubmenu(button);
            }
            if (typeof tool.action === 'function') {
                tool.action();
            } else if (toolId === 'toolbox') {
                this.toggleToolbox();
            } else {
                this.showPage(toolId);
            }
        } else {
            console.error(`Tool not found: ${toolId}`);
        }

        // Highlight the active button
        this.highlightActiveButton(button);
    }

    highlightActiveButton(button) {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        button.classList.add('active');
    }

    toggleSubmenu(button) {
        const submenu = button.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('expanded');
            button.classList.toggle('active');
        }
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.mainContent.classList.toggle('expanded');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
        this.updateMenuToggleIcon();
        
        // Adjust the margin of the main content
        if (this.sidebar.classList.contains('collapsed')) {
            this.mainContent.style.marginLeft = '60px';
        } else {
            this.mainContent.style.marginLeft = '250px';
        }
    }

    updateMenuToggleIcon() {
        const menuToggleIcon = this.menuToggle.querySelector('i');
        if (this.sidebar.classList.contains('collapsed')) {
            menuToggleIcon.classList.remove('fa-arrow-left');
            menuToggleIcon.classList.add('fa-arrow-right');
        } else {
            menuToggleIcon.classList.remove('fa-arrow-right');
            menuToggleIcon.classList.add('fa-arrow-left');
        }
    }

    toggleToolbox() {
        const toolboxBtn = document.getElementById('toolboxBtn');
        const toolboxSubmenu = toolboxBtn.nextElementSibling;
        
        if (toolboxSubmenu) {
            toolboxSubmenu.classList.toggle('expanded');
            toolboxBtn.classList.toggle('active');
        }
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        const page = document.getElementById(`${pageId}-page`);
        if (page) {
            page.style.display = 'block';
            document.title = `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} - BlueColar Form Builder`;
        } else {
            console.error(`Page with id "${pageId}-page" not found`);
        }
        this.highlightActiveButton(document.querySelector(`#${pageId}Btn`));
    }
}
