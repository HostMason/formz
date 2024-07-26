import { Tool } from './baseTool.js';
import { ReportGenerator } from '../reportGenerator.js';

class ReportGeneratorTool extends Tool {
    constructor() {
        super('reportGenerator', 'Report Generator', 'fas fa-file-alt');
        this.reportGenerator = new ReportGenerator();
    }

    init() {
        super.init();
        this.reportGenerator.initialize();
    }

    render() {
        return `
            <h2>${this.name}</h2>
            <div id="report-generator-container">
                <div id="report-controls">
                    <button id="create-report-btn">Create New Report</button>
                    <select id="report-list">
                        <option value="">Select a report</option>
                    </select>
                    <button id="edit-report-btn">Edit Report</button>
                    <button id="schedule-report-btn">Schedule Report</button>
                </div>
                <div id="report-editor">
                    <textarea id="report-content" rows="20" cols="80"></textarea>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.getElementById('create-report-btn')?.addEventListener('click', () => this.reportGenerator.createNewReport());
        document.getElementById('edit-report-btn')?.addEventListener('click', () => this.reportGenerator.editReport());
        document.getElementById('schedule-report-btn')?.addEventListener('click', () => this.reportGenerator.scheduleReport());
        document.getElementById('report-list')?.addEventListener('change', (e) => this.reportGenerator.loadReport(e.target.value));
    }
}

export default new ReportGeneratorTool();
