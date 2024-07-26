import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';
import { Router } from './router.js';
import { ThemeManager } from './themeManager.js';

class App {
    constructor() {
        this.router = new Router();
        this.toolManager = new ToolManager();
        this.uiManager = new UIManager(this.router, this.toolManager);
        this.themeManager = new ThemeManager();
    }

    async init() {
        await this.router.initializeRoutes();
        await this.toolManager.initializeTools();
        await this.uiManager.initializeUI();
        this.attachEventListeners();
        this.handleInitialRoute();
    }

    attachEventListeners() {
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
        document.getElementById('toggleTheme')?.addEventListener('click', () => {
            this.themeManager.toggleTheme();
        });
    }

    handleInitialRoute() {
        const path = window.location.pathname.substring(1) || 'landing';
        this.router.navigateTo(path);
    }

    handleRouteChange(event) {
        const path = event.state?.path || 'landing';
        this.router.navigateTo(path);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
});
