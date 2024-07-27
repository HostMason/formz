export class UIManager {
    constructor() {
        this.elements = {};
    }

    initializeUI(router, toolManager, themeManager, authManager) {
        this.router = router;
        this.toolManager = toolManager;
        this.themeManager = themeManager;
        this.authManager = authManager;

        this.renderBasicStructure();
        this.cacheElements();
        this.attachEventListeners();
        this.renderNavigation();
        this.updateUIForAuthState();
    }

    cacheElements() {
        this.elements = {
            app: document.getElementById('app'),
            sidebar: document.querySelector('.sidebar'),
            mainContent: document.querySelector('.main-content'),
            menuToggle: document.querySelector('.menu-toggle'),
            navList: document.querySelector('.nav-list'),
            authButtons: document.querySelector('.auth-buttons'),
            themeToggle: document.getElementById('toggleTheme') // Ensure this element exists
        };
    }

    renderBasicStructure() {
        // The structure is now defined in the index.html file
    }

    attachEventListeners() {
        this.elements.menuToggle.addEventListener('click', this.toggleSidebar.bind(this));
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', this.themeManager.toggleTheme.bind(this.themeManager));
        }
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.router.navigateTo(e.target.href);
            }
        });
    }

    renderNavigation() {
        this.elements.navList.innerHTML = '';
        if (this.authManager.isAuthenticated()) {
            this.toolManager.getAllTools().forEach(tool => {
                this.elements.navList.appendChild(this.createNavItem(tool));
            });
        }
    }

    createNavItem(tool) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-btn" id="${tool.id}Btn">
                <i class="${tool.icon}"></i> <span>${tool.name}</span>
            </button>
        `;
        return li;
    }

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
        this.updateMenuToggleIcon();
    }

    updateMenuToggleIcon() {
        const icon = this.elements.menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    updateUIForAuthState() {
        if (this.authManager.isAuthenticated()) {
            this.elements.authButtons.innerHTML = `
                <span>Welcome, ${this.authManager.user.name}</span>
                <button id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', this.authManager.logout.bind(this.authManager));
        } else {
            this.elements.authButtons.innerHTML = `
                <a href="/login" class="auth-link" data-link>Login</a>
                <a href="/register" class="auth-link" data-link>Register</a>
            `;
        }
        this.renderNavigation();
    }
}
