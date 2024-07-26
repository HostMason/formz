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
        return route.pageId;
    }

    handleNavigation(callback) {
        window.addEventListener('popstate', (event) => {
            const path = event.state?.path || '/';
            const pageId = this.navigateTo(path);
            callback(pageId);
        });
    }
}
