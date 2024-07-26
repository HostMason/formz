// Rename this file to app.js
import { Router } from './router.js';
import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';

class App {
    constructor() {
        this.router = new Router();
        this.uiManager = new UIManager();
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
            this.router.navigateTo(window.location.pathname);
        });

        window.addEventListener('popstate', (event) => {
            this.router.navigateTo(event.state.route);
        });
    }
}

const app = new App();
