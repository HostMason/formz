import { FormBuilder } from '../formBuilder.js';
import { DataAnalyzer } from '../dataAnalyzer.js';
import { ReportGenerator } from '../reportGenerator.js';

const toolbox = {
    init() {
        console.log('Toolbox initialized');
        this.renderToolboxContent();
        this.attachEventListeners();
    },

    renderToolboxContent() {
        const toolboxContent = `
            <div id="toolbox-container">
                <div id="toolbox-tabs" class="blue-bar">
                    <button class="tab-button active" data-tool="formBuilder">Form Builder</button>
                    <button class="tab-button" data-tool="dataAnalyzer">Data Analyzer</button>
                    <button class="tab-button" data-tool="reportGenerator">Report Generator</button>
                </div>
                <div id="toolbox-content"></div>
            </div>
        `;
        document.querySelector('.main-content').innerHTML = toolboxContent;
    },

    attachEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tool));
        });
    },

    switchTab(tool) {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

        const toolboxContent = document.getElementById('toolbox-content');
        toolboxContent.innerHTML = '';
        toolboxContent.style.opacity = '0';

        setTimeout(async () => {
            try {
                let module;
                switch (tool) {
                    case 'formBuilder':
                        module = await import('../tools/formBuilder.js');
                        break;
                    case 'dataAnalyzer':
                        module = await import('../dataAnalyzer.js');
                        break;
                    case 'reportGenerator':
                        module = await import('../reportGenerator.js');
                        break;
                    default:
                        throw new Error(`Unknown tool: ${tool}`);
                }

                if (module.default && typeof module.default.init === 'function') {
                    module.default.init();
                } else if (module[tool.charAt(0).toUpperCase() + tool.slice(1)] && typeof module[tool.charAt(0).toUpperCase() + tool.slice(1)].prototype.initialize === 'function') {
                    new module[tool.charAt(0).toUpperCase() + tool.slice(1)]().initialize();
                } else {
                    throw new Error(`Module ${tool} does not have a valid initialization method`);
                }

                toolboxContent.style.opacity = '1';
            } catch (error) {
                console.error(`Error loading tool ${tool}:`, error);
                toolboxContent.innerHTML = `<p>Error loading ${tool}. Please try again later.</p>`;
                toolboxContent.style.opacity = '1';
            }
        }, 300);
    }
};

export default toolbox;
