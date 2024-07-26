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
    }

    navigateTo(path) {
        const pageId = this.routes[path] || 'landing';
        history.pushState({ path: path }, null, path);
        document.dispatchEvent(new CustomEvent('navigate', { detail: { pageId: pageId } }));
    }
}
