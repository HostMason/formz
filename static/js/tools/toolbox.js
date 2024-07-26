import { ToolManager } from '../toolManager.js';

class Toolbox {
    constructor() {
        this.toolManager = new ToolManager();
    }

    async init() {
        console.log('Toolbox initialized');
        await this.loadTools();
        this.renderToolboxContent();
        this.attachEventListeners();
    }

    async loadTools() {
        const tools = [
            (await import('./formBuilder.js')).default,
            (await import('./dataAnalyzer.js')).default,
            (await import('./reportGenerator.js')).default
        ];
        tools.forEach(tool => this.toolManager.registerTool(tool));
    }

    renderToolboxContent() {
        const toolboxContent = `
            <div id="toolbox-container">
                <div id="toolbox-tabs" class="blue-bar">
                    ${this.toolManager.getAllTools().map(tool => `
                        <button class="tab-button" data-tool="${tool.id}">
                            <i class="${tool.icon}"></i> ${tool.name}
                        </button>
                    `).join('')}
                </div>
                <div id="toolbox-content"></div>
            </div>
        `;
        document.querySelector('.main-content').innerHTML = toolboxContent;
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
                const tool = this.toolManager.getTool(toolId);
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
}

export default new Toolbox();
