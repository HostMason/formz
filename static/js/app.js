import { Router } from './router.js';
import { UIManager } from './uiManager.js';

class App {
    constructor() {
        this.router = new Router();
        this.uiManager = new UIManager(this.router);
        this.initializeApp();
    }

    initializeApp() {
        this.uiManager.initializeUI();
        this.router.initializeRoutes();
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
