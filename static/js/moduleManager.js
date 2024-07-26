// Module Manager for SaaS system
class ModuleManager {
    constructor() {
        this.modules = {};
    }

    registerModule(name, module) {
        this.modules[name] = module;
    }

    getModule(name) {
        return this.modules[name];
    }

    initializeAllModules() {
        for (const moduleName in this.modules) {
            if (typeof this.modules[moduleName].initialize === 'function') {
                this.modules[moduleName].initialize();
            }
        }
    }
}

export const moduleManager = new ModuleManager();
