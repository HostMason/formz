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

        setTimeout(() => {
            switch (tool) {
                case 'formBuilder':
                    new FormBuilder().initialize();
                    break;
                case 'dataAnalyzer':
                    new DataAnalyzer().initialize();
                    break;
                case 'reportGenerator':
                    new ReportGenerator().initialize();
                    break;
            }
            toolboxContent.style.opacity = '1';
        }, 300);
    }
};

export default toolbox;
