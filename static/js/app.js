import { Router } from './router.js';
import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';

class App {
    constructor() {
        this.router = new Router();
        this.uiManager = new UIManager(this.router);
        this.toolManager = new ToolManager();
        this.initializeApp();
    }

    initializeApp() {
        this.uiManager.initializeUI();
        this.router.initializeRoutes();
        this.toolManager.initializeTools();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.router.navigateTo(window.location.pathname);
        });

        window.addEventListener('popstate', (event) => {
            this.router.navigateTo(event.state.route);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
