import { DataAnalyzer } from '../dataAnalyzer.js';

const dataAnalyzer = {
    init() {
        console.log('Data Analyzer initialized');
        this.dataAnalyzer = new DataAnalyzer();
        this.dataAnalyzer.initialize();
        this.renderDataAnalyzer();
        this.attachEventListeners();
    },

    renderDataAnalyzer() {
        const dataAnalyzerHTML = `
            <h2>Data Analyzer</h2>
            <div id="data-analyzer-container">
                <div id="data-controls">
                    <input type="file" id="import-data" accept=".csv,.json">
                    <button id="analyze-data-btn">Analyze Data</button>
                    <button id="export-results-btn">Export Results</button>
                </div>
                <div id="data-view"></div>
                <div id="analysis-results"></div>
            </div>
        `;
        document.getElementById('toolbox-content').innerHTML = dataAnalyzerHTML;
    },

    attachEventListeners() {
        document.getElementById('import-data')?.addEventListener('change', (e) => this.dataAnalyzer.importData(e));
        document.getElementById('analyze-data-btn')?.addEventListener('click', () => this.dataAnalyzer.analyzeData());
        document.getElementById('export-results-btn')?.addEventListener('click', () => this.dataAnalyzer.exportResults());
    }
};

export default dataAnalyzer;
