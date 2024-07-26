import { ReportGenerator } from '../reportGenerator.js';

const reportGenerator = {
    init() {
        console.log('Report Generator initialized');
        this.reportGenerator = new ReportGenerator();
        this.reportGenerator.initialize();
        this.renderReportGenerator();
        this.attachEventListeners();
    },

    renderReportGenerator() {
        const reportGeneratorHTML = `
            <h2>Report Generator</h2>
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
        document.getElementById('toolbox-content').innerHTML = reportGeneratorHTML;
    },

    attachEventListeners() {
        document.getElementById('create-report-btn')?.addEventListener('click', () => this.reportGenerator.createNewReport());
        document.getElementById('edit-report-btn')?.addEventListener('click', () => this.reportGenerator.editReport());
        document.getElementById('schedule-report-btn')?.addEventListener('click', () => this.reportGenerator.scheduleReport());
        document.getElementById('report-list')?.addEventListener('change', (e) => this.reportGenerator.loadReport(e.target.value));
    }
};

export default reportGenerator;
