export class ToolManager {
    constructor() {
        this.tools = [];
    }

    addTool(tool) {
        this.tools.push(tool);
    }

    getTools() {
        return this.tools;
    }

    getToolsByCustomerAccount(accountType) {
        // In a real-world scenario, this would filter tools based on the account type
        // For now, we'll return all tools
        return this.tools;
    }
}

export class Tool {
    constructor(id, name, icon, action, subTools = []) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.action = action;
        this.subTools = subTools;
    }
}
