export class ToolManager {
    constructor() {
        this.tools = new Map();
    }

    registerTool(tool) {
        this.tools.set(tool.id, tool);
    }

    getTool(id) {
        return this.tools.get(id);
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }
}
