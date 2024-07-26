// Module Manager for SaaS system
class ModuleManager {
    constructor() {
        this.modules = {};
        this.sidebarButtons = {};
    }

    registerModule(name, module) {
        this.modules[name] = module;
    }

    getModule(name) {
        return this.modules[name];
    }

    registerSidebarButton(id, clickHandler) {
        this.sidebarButtons[id] = clickHandler;
    }

    initializeAllModules() {
        for (const moduleName in this.modules) {
            if (typeof this.modules[moduleName].initialize === 'function') {
                this.modules[moduleName].initialize();
            }
        }
    }

    initializeSidebarButtons() {
        for (const buttonId in this.sidebarButtons) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', this.sidebarButtons[buttonId]);
            }
        }
    }
}

export const moduleManager = new ModuleManager();
