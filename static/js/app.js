import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';
import { Router } from './router.js';
import { ThemeManager } from './themeManager.js';
import { AuthManager } from './authManager.js';
import { APIClient } from './apiClient.js';

class App {
    constructor() {
        this.router = new Router();
        this.toolManager = new ToolManager();
        this.uiManager = new UIManager();
        this.themeManager = new ThemeManager();
        this.authManager = new AuthManager();
        this.apiClient = new APIClient();
    }

    async init() {
        try {
            await this.authManager.init();
            await this.router.initializeRoutes();
            if (!this.toolManager.isToolRegistered('formBuilder')) {
                await this.toolManager.initializeTools();
            }
            this.uiManager.initializeUI(this.router, this.toolManager, this.themeManager, this.authManager);
            this.attachEventListeners();
            this.handleInitialRoute();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.uiManager.showErrorMessage('Failed to initialize the application. Please try again later.');
        }
    }

    attachEventListeners() {
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
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
    window.app = new App();
    await window.app.init();
});
