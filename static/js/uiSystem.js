import { ToolManager, Tool } from './toolManager.js';

export class UISystem {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.toolManager = new ToolManager();
        this.initializeTools();
        this.initializeEventListeners();
    }

    initializeTools() {
        const formBuilderTool = new Tool('formBuilder', 'Form Builder', 'fas fa-file-alt', () => this.showPage('formBuilder'), [
            new Tool('loadForm', 'Load Form', 'fas fa-folder-open', () => console.log('Load form clicked')),
            new Tool('saveForm', 'Save Form', 'fas fa-save', () => this.formBuilder.saveForm()),
            new Tool('deleteForm', 'Delete Form', 'fas fa-trash-alt', () => console.log('Delete form clicked')),
            new Tool('customFields', 'Custom Fields', 'fas fa-puzzle-piece', () => this.showPage('customFields')),
            new Tool('templates', 'Templates', 'fas fa-file-code', () => this.showPage('templates'))
        ]);

        this.toolManager.addTool(formBuilderTool);
        this.toolManager.addTool(new Tool('help', 'Help', 'fas fa-question-circle', () => this.showPage('help')));
        this.toolManager.addTool(new Tool('settings', 'Settings', 'fas fa-cog', () => this.showPage('settings')));
    }

    initializeEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.showPage('landing'));
        this.renderNavigation();
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = ''; // Clear existing navigation

        this.toolManager.getTools().forEach(tool => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <button class="nav-btn" id="${tool.id}Btn">
                    <i class="${tool.icon}"></i> <span>${tool.name}</span>
                </button>
            `;
            if (tool.subTools.length > 0) {
                const subMenu = document.createElement('ul');
                subMenu.className = 'submenu';
                tool.subTools.forEach(subTool => {
                    subMenu.innerHTML += `
                        <li>
                            <button class="nav-btn" id="${subTool.id}Btn">
                                <i class="${subTool.icon}"></i> <span>${subTool.name}</span>
                            </button>
                        </li>
                    `;
                });
                li.appendChild(subMenu);
            }
            navList.appendChild(li);
        });

        // Add event listeners to the newly created buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.mainContent.classList.toggle('expanded');
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
        this.updateMenuToggleIcon();
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

    toggleFormsSubsection(event) {
        event.stopPropagation();
        const formsBtn = document.getElementById('formsBtn');
        const formsSubmenu = formsBtn.nextElementSibling;
        formsSubmenu.classList.toggle('expanded');
        formsBtn.classList.toggle('active');
    }

    toggleToolbox() {
        const toolboxBtn = document.getElementById('toolboxBtn');
        const formsSubsection = document.querySelector('.submenu');
    
        toolboxBtn.classList.toggle('active');
        formsSubsection.classList.toggle('expanded');
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
    }
}
