export class Router {
    constructor() {
        this.routes = {};
    }

    addRoute(path, pageId) {
        this.routes[path] = pageId;
    }

    initializeRoutes() {
        this.addRoute('/', 'landing');
        this.addRoute('/form-builder', 'formBuilder');
        this.addRoute('/help', 'help');
        this.addRoute('/settings', 'settings');
        // Add more routes as needed
    }

    navigateTo(path) {
        const pageId = this.routes[path] || 'landing';
        history.pushState({ path: path }, null, path);
        return pageId;
    }

    handleNavigation(callback) {
        window.addEventListener('popstate', (event) => {
            const path = event.state ? event.state.path : '/';
            const pageId = this.navigateTo(path);
            callback(pageId);
        });
    }
}
