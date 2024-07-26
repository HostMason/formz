export class ToolManager {
    constructor() {
        this.tools = [];
    }

    initializeTools() {
        this.addTool('Form Builder', 'fas fa-file-alt', '/form-builder');
        this.addTool('Help', 'fas fa-question-circle', '/help');
        this.addTool('Settings', 'fas fa-cog', '/settings');
        // Add more tools as needed
    }

    addTool(name, icon, route) {
        this.tools.push({ name, icon, route });
    }

    getAllTools() {
        return this.tools;
    }
}
