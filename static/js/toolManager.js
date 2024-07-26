export class ToolManager {
    constructor() {
        this.tools = new Map();
    }

    addTool(tool) {
        this.tools.set(tool.id, tool);
    }

    getTool(id) {
        return this.tools.get(id);
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }

    initializeTools() {
        const toolbox = new Tool('toolbox', 'Toolbox', 'fas fa-toolbox', '/toolbox');
        const formBuilder = new Tool('formBuilder', 'Form Builder', 'fas fa-file-alt', '/form-builder');
        const dataAnalyzer = new Tool('dataAnalyzer', 'Data Analyzer', 'fas fa-chart-bar', '/data-analyzer');
        const reportGenerator = new Tool('reportGenerator', 'Report Generator', 'fas fa-file-alt', '/report-generator');
        const help = new Tool('help', 'Help', 'fas fa-question-circle', '/help');
        const settings = new Tool('settings', 'Settings', 'fas fa-cog', '/settings');

        toolbox.addSubTool(formBuilder);
        toolbox.addSubTool(dataAnalyzer);
        toolbox.addSubTool(reportGenerator);

        this.addTool(toolbox);
        this.addTool(help);
        this.addTool(settings);
    }
}

export class Tool {
    constructor(id, name, icon, route) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.route = route;
        this.subTools = [];
    }

    addSubTool(subTool) {
        this.subTools.push(subTool);
    }
}
