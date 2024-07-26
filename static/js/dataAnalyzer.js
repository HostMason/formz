export class DataAnalyzer {
    constructor() {
        this.data = null;
    }

    initialize() {
        this.renderDataAnalyzer();
        this.initializeEventListeners();
    }

    renderDataAnalyzer() {
        const dataAnalyzerHTML = `
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
        document.getElementById('main-content').innerHTML = dataAnalyzerHTML;
    }

    initializeEventListeners() {
        document.getElementById('import-data').addEventListener('change', (e) => this.importData(e));
        document.getElementById('analyze-data-btn').addEventListener('click', () => this.analyzeData());
        document.getElementById('export-results-btn').addEventListener('click', () => this.exportResults());
    }

    importData(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.data = JSON.parse(e.target.result);
                this.displayData();
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error importing data. Please make sure it\'s a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }

    displayData() {
        const dataView = document.getElementById('data-view');
        dataView.innerHTML = '<h3>Imported Data:</h3>';
        dataView.appendChild(this.createTable(this.data));
    }

    createTable(data) {
        const table = document.createElement('table');
        const headers = Object.keys(data[0]);
        
        // Create header row
        const headerRow = table.insertRow();
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        // Create data rows
        data.forEach(row => {
            const dataRow = table.insertRow();
            headers.forEach(header => {
                const cell = dataRow.insertCell();
                cell.textContent = row[header];
            });
        });

        return table;
    }

    analyzeData() {
        if (!this.data) {
            alert('Please import data first.');
            return;
        }

        const results = {
            rowCount: this.data.length,
            columnCount: Object.keys(this.data[0]).length,
        };

        const analysisResults = document.getElementById('analysis-results');
        analysisResults.innerHTML = '<h3>Analysis Results:</h3>';
        analysisResults.appendChild(this.createTable([results]));
    }

    exportResults() {
        if (!this.data) {
            alert('No data to export.');
            return;
        }

        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}
