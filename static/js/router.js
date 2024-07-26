export class Router {
    constructor(uiManager) {
        this.routes = {};
        this.uiManager = uiManager;
    }

    addRoute(path, component) {
        this.routes[path] = component;
    }

    initializeRoutes() {
        this.addRoute('/', 'LandingPage');
        this.addRoute('/form-builder', 'FormBuilder');
        this.addRoute('/help', 'HelpPage');
        this.addRoute('/settings', 'SettingsPage');
        // Add more routes as needed
    }

    navigateTo(path) {
        const component = this.routes[path];
        if (component) {
            history.pushState({ route: path }, null, path);
            this.loadComponent(component);
        } else {
            console.error(`Route not found: ${path}`);
        }
    }

    loadComponent(componentName) {
        import(`./components/${componentName}.js`)
            .then(module => {
                const component = new module.default();
                this.uiManager.mainContent.innerHTML = component.render();
                if (component.afterRender) {
                    component.afterRender();
                }
            })
            .catch(error => console.error(`Error loading component: ${componentName}`, error));
    }
}
