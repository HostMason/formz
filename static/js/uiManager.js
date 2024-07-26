import { ToolManager, Tool } from './toolManager.js';
import { FormBuilder } from './formBuilder.js';

export class UIManager {
    constructor(router) {
        this.sidebar = null;
        this.mainContent = null;
        this.menuToggle = null;
        this.toolManager = new ToolManager();
        this.router = router;
        this.formBuilder = new FormBuilder();
    }

    initializeUI() {
        this.renderBasicStructure();
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.initializeTools();
        this.attachEventListeners();
        this.renderNavigation();
        this.showLandingPage();
        this.updateMenuToggleIcon();
    }

    initializeTools() {
        const toolbox = new Tool('toolbox', 'Toolbox', 'fas fa-toolbox', () => this.toggleToolbox());
        
        const formBuilder = new Tool('formBuilder', 'Form Builder', 'fas fa-file-alt', () => {
            if (this.sidebar.classList.contains('collapsed')) {
                this.toggleSidebar();
            }
            this.showPage('formBuilder');
        });
        formBuilder.addSubTool(new Tool('createForm', 'Create Form', 'fas fa-plus', () => this.showPage('createForm')));
        formBuilder.addSubTool(new Tool('editForm', 'Edit Form', 'fas fa-edit', () => this.showPage('editForm')));
        formBuilder.addSubTool(new Tool('viewForms', 'View Forms', 'fas fa-list', () => this.showPage('viewForms')));
        formBuilder.addSubTool(new Tool('formTemplates', 'Form Templates', 'fas fa-copy', () => this.showPage('formTemplates')));
        formBuilder.addSubTool(new Tool('formSettings', 'Form Settings', 'fas fa-cog', () => this.showPage('formSettings')));

        const dataAnalyzer = new Tool('dataAnalyzer', 'Data Analyzer', 'fas fa-chart-bar', () => this.showPage('dataAnalyzer'));
        dataAnalyzer.addSubTool(new Tool('importData', 'Import Data', 'fas fa-file-import', () => console.log('Import data clicked')));
        dataAnalyzer.addSubTool(new Tool('analyzeData', 'Analyze Data', 'fas fa-microscope', () => console.log('Analyze data clicked')));
        dataAnalyzer.addSubTool(new Tool('exportResults', 'Export Results', 'fas fa-file-export', () => console.log('Export results clicked')));

        const reportGenerator = new Tool('reportGenerator', 'Report Generator', 'fas fa-file-alt', () => this.showPage('reportGenerator'));
        reportGenerator.addSubTool(new Tool('createReport', 'Create Report', 'fas fa-plus', () => console.log('Create report clicked')));
        reportGenerator.addSubTool(new Tool('editTemplate', 'Edit Template', 'fas fa-edit', () => console.log('Edit template clicked')));
        reportGenerator.addSubTool(new Tool('scheduleReport', 'Schedule Report', 'fas fa-calendar-alt', () => console.log('Schedule report clicked')));

        toolbox.addSubTool(formBuilder);
        toolbox.addSubTool(dataAnalyzer);
        toolbox.addSubTool(reportGenerator);

        this.toolManager.addTool(toolbox);
        this.toolManager.addTool(new Tool('help', 'Help', 'fas fa-question-circle', () => this.showPage('help')));
        this.toolManager.addTool(new Tool('settings', 'Settings', 'fas fa-cog', () => this.showPage('settings')));
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
        
        if (tool.subTools.length > 0) {
            const subMenu = document.createElement('ul');
            subMenu.className = 'submenu';
            tool.subTools.forEach(subTool => {
                subMenu.appendChild(this.createNavItem(subTool));
            });
            li.appendChild(subMenu);
        }
        
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
            if (tool.subTools.length > 0) {
                this.toggleSubmenu(button);
            }
            if (typeof tool.action === 'function') {
                tool.action();
            }
            if (toolId === 'toolbox') {
                const submenu = button.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.add('expanded');
                }
            }
            this.highlightActiveButton(button);
        } else {
            console.error(`Tool not found: ${toolId}`);
        }
    }

    toggleSubmenu(button) {
        const submenu = button.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('expanded');
        }
    }

    highlightActiveButton(button) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Expand parent submenus if any
        let parent = button.closest('.submenu');
        while (parent) {
            parent.classList.add('expanded');
            parent = parent.parentElement.closest('.submenu');
        }
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

    toggleToolbox() {
        const toolboxBtn = document.getElementById('toolboxBtn');
        const toolboxSubmenu = toolboxBtn.nextElementSibling;
        
        if (toolboxSubmenu) {
            toolboxSubmenu.classList.toggle('expanded');
            toolboxBtn.classList.toggle('active');
        }
    }

    showLandingPage() {
        this.showPage('landing');
    }

    showPage(pageId) {
        import(`./components/${pageId.charAt(0).toUpperCase() + pageId.slice(1)}.js`).then(module => {
            const page = new module.default();
            this.mainContent.innerHTML = page.render();
            if (page.afterRender) {
                page.afterRender();
            }
        }).catch(error => {
            console.error(`Error loading page: ${pageId}`, error);
        });
    }
}
