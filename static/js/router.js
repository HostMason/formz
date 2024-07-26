export class Router {
    constructor() {
        this.routes = new Map();
    }

    addRoute(path, pageId) {
        this.routes.set(path, pageId);
    }

    async initializeRoutes() {
        this.addRoute('/', 'landing');
        this.addRoute('/form-builder', 'formBuilder');
        this.addRoute('/help', 'help');
        this.addRoute('/settings', 'settings');
        // Add more routes as needed
    }

    navigateTo(path) {
        const pageId = this.routes.get(path) || 'landing';
        history.pushState({ path }, null, path);
        return pageId;
    }

    handleNavigation(callback) {
        window.addEventListener('popstate', (event) => {
            const path = event.state?.path || '/';
            const pageId = this.navigateTo(path);
            callback(pageId);
        });
    }
}
