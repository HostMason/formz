import { UIManager } from './uiManager.js';
import { ToolManager } from './toolManager.js';

class App {
    constructor() {
        this.uiManager = new UIManager();
        this.toolManager = new ToolManager();
        this.initializeApp();
    }

    initializeApp() {
        this.uiManager.initializeUI();
        this.toolManager.initializeTools();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname.substring(1) || 'landing';
            this.uiManager.showPage(path);
        });

        window.addEventListener('popstate', (event) => {
            const path = event.state ? event.state.path : 'landing';
            this.uiManager.showPage(path);
        });
    }
}

const app = new App();
