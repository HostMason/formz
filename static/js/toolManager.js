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
}

export class Tool {
    constructor(id, name, icon, action) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.action = action;
    }
}
