import Component from './Component.js';

export default class ViewForms extends Component {
    render() {
        return `
            <div id="viewForms-page" class="page">
                <h1>View Forms</h1>
                <table id="forms-table">
                    <thead>
                        <tr>
                            <th>Form Name</th>
                            <th>Created Date</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- This will be populated with form data -->
                    </tbody>
                </table>
            </div>
        `;
    }

    afterRender() {
        // Implement form listing and action functionality
    }
}
