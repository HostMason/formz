import { Tool } from './baseTool.js';

class Toolbox extends Tool {
    constructor() {
        super('toolbox', 'Toolbox', 'fas fa-toolbox');
    }

    init() {
        console.log('Toolbox initialized');
        this.renderToolboxContent();
        this.attachEventListeners();
    }

    renderToolboxContent() {
        const toolboxContent = `
            <div id="toolbox-container">
                <div id="toolbox-tabs" class="blue-bar">
                    ${this.getToolButtons()}
                </div>
                <div id="toolbox-content"></div>
            </div>
        `;
        document.querySelector('.main-content').innerHTML = toolboxContent;
    }

    getToolButtons() {
        const tools = ['formBuilder', 'dataAnalyzer', 'reportGenerator'];
        return tools.map(toolId => {
            const tool = window.app.toolManager.getTool(toolId);
            return `
                <button class="tab-button" data-tool="${tool.id}">
                    <i class="${tool.icon}"></i> ${tool.name}
                </button>
            `;
        }).join('');
    }

    attachEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tool));
        });
    }

    switchTab(toolId) {
        const toolboxContent = document.getElementById('toolbox-content');
        toolboxContent.innerHTML = '';
        const tool = window.app.toolManager.getTool(toolId);
        if (tool) {
            tool.init();
            toolboxContent.innerHTML = tool.render();
            tool.attachEventListeners();
        } else {
            console.error(`Tool ${toolId} not found`);
        }
    }
}

export default new Toolbox();
