import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';
import { Router } from './router.js';

class App {
    constructor() {
        this.router = new Router();
        this.uiManager = new UIManager(this.router);
        this.toolManager = new ToolManager();
        this.initializeApp();
    }

    initializeApp() {
        this.router.initializeRoutes();
        this.uiManager.initializeUI();
        this.toolManager.initializeTools();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname.substring(1) || 'landing';
            this.router.navigateTo(path);
        });

        window.addEventListener('popstate', (event) => {
            const path = event.state ? event.state.path : 'landing';
            this.router.navigateTo(path);
        });
    }
}

const app = new App();
