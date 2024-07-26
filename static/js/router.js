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
        this.addRoute('/create-form', 'createForm');
        this.addRoute('/edit-form', 'editForm');
        this.addRoute('/view-forms', 'viewForms');
        this.addRoute('/form-templates', 'formTemplates');
        this.addRoute('/data-analyzer', 'dataAnalyzer');
        this.addRoute('/import-data', 'importData');
        this.addRoute('/analyze-data', 'analyzeData');
        this.addRoute('/export-results', 'exportResults');
        this.addRoute('/report-generator', 'reportGenerator');
        this.addRoute('/create-report', 'createReport');
        this.addRoute('/edit-template', 'editTemplate');
        this.addRoute('/schedule-report', 'scheduleReport');
        this.addRoute('/help', 'help');
        this.addRoute('/settings', 'settings');
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
