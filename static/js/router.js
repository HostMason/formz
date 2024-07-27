export class Router {
    constructor() {
        this.routes = new Map();
        this.authRoutes = new Set(['login', 'register', 'forgot-password']);
    }

    addRoute(path, pageId, requiresAuth = true) {
        this.routes.set(path, { pageId, requiresAuth });
    }

    async initializeRoutes() {
        this.addRoute('/', 'landing', false);
        this.addRoute('/login', 'login', false);
        this.addRoute('/register', 'register', false);
        this.addRoute('/forgot-password', 'forgotPassword', false);
        this.addRoute('/dashboard', 'dashboard');
        this.addRoute('/form-builder', 'formBuilder');
        this.addRoute('/data-analyzer', 'dataAnalyzer');
        this.addRoute('/report-generator', 'reportGenerator');
        this.addRoute('/help', 'help');
        this.addRoute('/settings', 'settings');
    }

    async renderPage(pageId) {
        const pageContent = await this.fetchPageContent(pageId);
        document.querySelector('.main-content').innerHTML = pageContent;
        this.updatePageTitle(pageId);
    }

    navigateTo(path) {
        const route = this.routes.get(path);
        if (!route) {
            return this.navigateTo('/');
        }

        if (route.requiresAuth && !window.app.authManager.isAuthenticated()) {
            return this.navigateTo('/login');
        }

        if (this.authRoutes.has(route.pageId) && window.app.authManager.isAuthenticated()) {
            return this.navigateTo('/dashboard');
        }

        history.pushState({ path }, null, path);
        this.renderPage(route.pageId);
    }

    handleNavigation(callback) {
        window.addEventListener('popstate', (event) => {
            const path = event.state?.path || '/';
            const pageId = this.navigateTo(path);
            callback(pageId);
        });
    }

    async fetchPageContent(pageId) {
        try {
            const response = await fetch(`/static/templates/${pageId}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
                <p>Welcome to the ${pageId} page. This is default content.</p>
            </div>
        `;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
