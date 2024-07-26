import Component from './Component.js';

export default class Forms extends Component {
    render() {
        return `
            <div id="forms-page" class="page">
                <h1>Forms Dashboard</h1>
                <p>Welcome to the Forms Dashboard. Here you can manage all your forms.</p>
                <div class="dashboard-actions">
                    <button onclick="this.uiManager.showPage('createForm')">Create New Form</button>
                    <button onclick="this.uiManager.showPage('viewForms')">View All Forms</button>
                    <button onclick="this.uiManager.showPage('formTemplates')">Form Templates</button>
                    <button onclick="this.uiManager.showPage('formSettings')">Form Settings</button>
                </div>
            </div>
        `;
    }
}
