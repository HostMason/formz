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
        const toolbox = new Tool('toolbox', 'Toolbox', 'fas fa-toolbox', () => this.toggleToolbox());
        
        const formBuilder = new Tool('formBuilder', 'Form Builder', 'fas fa-file-alt', () => this.showPage('formBuilder'));
        formBuilder.addSubTool(new Tool('loadForm', 'Load Form', 'fas fa-folder-open', () => console.log('Load form clicked')));
        formBuilder.addSubTool(new Tool('saveForm', 'Save Form', 'fas fa-save', () => this.formBuilder.saveForm()));
        formBuilder.addSubTool(new Tool('deleteForm', 'Delete Form', 'fas fa-trash-alt', () => console.log('Delete form clicked')));
        formBuilder.addSubTool(new Tool('customFields', 'Custom Fields', 'fas fa-puzzle-piece', () => this.showPage('customFields')));
        formBuilder.addSubTool(new Tool('templates', 'Templates', 'fas fa-file-code', () => this.showPage('templates')));
        
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

    initializeEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.showPage('landing'));
        this.renderNavigation();
    }

    renderNavigation() {
        const navList = document.querySelector('.nav-list');
        navList.innerHTML = ''; // Clear existing navigation

        this.toolManager.getAllTools().forEach(tool => {
            navList.appendChild(this.createNavItem(tool));
        });

        // Add event listeners to the newly created buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavItemClick(e));
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

    handleNavItemClick(e) {
        const button = e.currentTarget;
        const toolId = button.id.replace('Btn', '');
        const tool = this.toolManager.getTool(toolId);
        
        if (tool) {
            if (tool.subTools.length > 0) {
                this.toggleSubmenu(button);
            }
            tool.action();
        }
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
    }
}
