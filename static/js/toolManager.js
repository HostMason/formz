export class ToolManager {
    constructor() {
        this.tools = new Map();
    }

    async initializeTools() {
        const toolModules = [
            import('./tools/formBuilder.js'),
            import('./tools/dataAnalyzer.js'),
            import('./tools/reportGenerator.js'),
            import('./tools/landing.js'),
            import('./tools/help.js'),
            import('./tools/settings.js')
        ];

        const loadedModules = await Promise.all(toolModules);
        loadedModules.forEach(module => {
            const tool = module.default;
            this.registerTool(tool);
        });
    }

    registerTool(tool) {
        this.tools.set(tool.id, tool);
    }

    isToolRegistered(id) {
        return this.tools.has(id);
    }


    isToolRegistered(id) {
        return this.tools.has(id);
    }

    getTool(id) {
        return this.tools.get(id);
    }

    getAllTools() {
        return Array.from(this.tools.values());
    }
}
