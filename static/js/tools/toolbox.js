import { DataAnalyzer } from '../dataAnalyzer.js';
import { ReportGenerator } from '../reportGenerator.js';

class Toolbox {
    constructor() {
        this.tools = {
            formBuilder: null,
            dataAnalyzer: null,
            reportGenerator: null
        };
    }

    async init() {
        console.log('Toolbox initialized');
        await this.loadTools();
        this.renderToolboxContent();
        this.attachEventListeners();
    }

    async loadTools() {
        this.tools.formBuilder = (await import('./formBuilder.js')).default;
        this.tools.dataAnalyzer = new DataAnalyzer();
        this.tools.reportGenerator = new ReportGenerator();
    }

    renderToolboxContent() {
        const toolboxContent = `
            <div id="toolbox-container">
                <div id="toolbox-tabs" class="blue-bar">
                    <button class="tab-button active" data-tool="formBuilder">
                        <i class="fas fa-wpforms"></i> Form Builder
                    </button>
                    <button class="tab-button" data-tool="dataAnalyzer">
                        <i class="fas fa-chart-bar"></i> Data Analyzer
                    </button>
                    <button class="tab-button" data-tool="reportGenerator">
                        <i class="fas fa-file-alt"></i> Report Generator
                    </button>
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

    switchTab(tool) {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

        const toolboxContent = document.getElementById('toolbox-content');
        toolboxContent.innerHTML = '';
        toolboxContent.style.opacity = '0';

        setTimeout(() => {
            try {
                if (this.tools[tool] && typeof this.tools[tool].init === 'function') {
                    this.tools[tool].init();
                } else {
                    throw new Error(`Tool ${tool} does not have a valid initialization method`);
                }

                toolboxContent.style.opacity = '1';
            } catch (error) {
                console.error(`Error loading tool ${tool}:`, error);
                toolboxContent.innerHTML = `<p>Error loading ${tool}. Please try again later.</p>`;
                toolboxContent.style.opacity = '1';
            }
        }, 300);
    }
}

export default new Toolbox();
