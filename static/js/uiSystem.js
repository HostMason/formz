export class UISystem {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('toolboxBtn').addEventListener('click', () => this.toggleToolbox());
        document.getElementById('formsBtn').addEventListener('click', (e) => this.toggleFormsSubsection(e));
        document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavItemClick(e));
        });
        document.getElementById('hostMasonLogo').addEventListener('click', () => this.showPage('landing'));
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
        const formsSubsection = document.querySelector('.submenu');

        toolboxBtn.classList.toggle('active');
        formsSubsection.classList.toggle('expanded');

        // Prevent the default action (navigating to the landing page)
        event.preventDefault();
        event.stopPropagation();
    }

    toggleFormsSubsection(event) {
        event.stopPropagation();
        const formsBtn = document.getElementById('formsBtn');
        const formsSubmenu = formsBtn.nextElementSibling;
        formsSubmenu.classList.toggle('expanded');
        formsBtn.classList.toggle('active');
    }

    handleNavItemClick(e) {
        const action = e.currentTarget.id;

        switch (action) {
            case 'formsBtn':
                this.toggleFormsSubsection(e);
                return;
            case 'formBuilderBtn':
            case 'loadFormBtn':
            case 'saveFormBtn':
            case 'deleteFormBtn':
            case 'customFieldsBtn':
            case 'templatesBtn':
            case 'settingsBtn':
            case 'helpBtn':
                this.showPage(action.replace('Btn', ''));
                break;
            default:
                this.showPage('landing');
                break;
        }

        document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (['formBuilderBtn', 'loadFormBtn', 'saveFormBtn', 'deleteFormBtn'].includes(action)) {
            const toolboxSection = document.getElementById('toolboxSection');
            const toolboxBtn = document.getElementById('toolboxBtn');
            const formsSubsection = document.getElementById('formsSubsection');
            const formsBtn = document.getElementById('formsBtn');

            if (toolboxSection) toolboxSection.classList.add('expanded');
            if (toolboxBtn) toolboxBtn.classList.add('active');
            if (formsSubsection) formsSubsection.classList.add('expanded');
            if (formsBtn) formsBtn.classList.add('active');
        }

        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        const page = document.getElementById(`${pageId}-page`);
        if (page) {
            page.style.display = 'block';
            document.title = `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} - BlueColar Form Builder`;
        }
    }
}
