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

    getToolsByCustomerAccount(accountType) {
        // In a real-world scenario, this would filter tools based on the account type
        // For now, we'll return all tools
        return this.getAllTools();
    }
}

export class Tool {
    constructor(id, name, icon, action, parentId = null) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.action = action;
        this.parentId = parentId;
        this.subTools = [];
    }

    addSubTool(tool) {
        tool.parentId = this.id;
        this.subTools.push(tool);
    }
}
