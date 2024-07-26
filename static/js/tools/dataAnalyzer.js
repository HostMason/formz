import { Tool } from './baseTool.js';
import { DataAnalyzer } from '../dataAnalyzer.js';

class DataAnalyzerTool extends Tool {
    constructor() {
        super('dataAnalyzer', 'Data Analyzer', 'fas fa-chart-bar');
        this.dataAnalyzer = new DataAnalyzer();
    }

    init() {
        super.init();
        this.dataAnalyzer.initialize();
    }

    render() {
        return `
            <h2>${this.name}</h2>
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
    }

    attachEventListeners() {
        document.getElementById('import-data')?.addEventListener('change', (e) => this.dataAnalyzer.importData(e));
        document.getElementById('analyze-data-btn')?.addEventListener('click', () => this.dataAnalyzer.analyzeData());
        document.getElementById('export-results-btn')?.addEventListener('click', () => this.dataAnalyzer.exportResults());
    }
}

export default new DataAnalyzerTool();
