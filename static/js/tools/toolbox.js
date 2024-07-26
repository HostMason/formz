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
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');

        const toolboxContent = document.getElementById('toolbox-content');
        toolboxContent.innerHTML = '';
        toolboxContent.style.opacity = '0';

        setTimeout(() => {
            try {
                const tool = window.app.toolManager.getTool(toolId);
                if (tool) {
                    tool.init();
                    toolboxContent.innerHTML = tool.render();
                    tool.attachEventListeners();
                } else {
                    throw new Error(`Tool ${toolId} not found`);
                }

                toolboxContent.style.opacity = '1';
            } catch (error) {
                console.error(`Error loading tool ${toolId}:`, error);
                toolboxContent.innerHTML = `<p>Error loading ${toolId}. Please try again later.</p>`;
                toolboxContent.style.opacity = '1';
            }
        }, 300);
    }

    render() {
        return this.renderToolboxContent();
    }
}

export default new Toolbox();
