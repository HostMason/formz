import Component from './Component.js';

export default class LandingPage extends Component {
    render() {
        return `
            <div id="landing-page" class="page">
                <h1>Welcome to HostMason Internal Tools</h1>
                <p>This is the internal system for HostMason customers. Here you can access various tools to manage and customize your services.</p>
                <h2>Available Tools:</h2>
                <ul>
                    <li>Form Builder
                        <ul>
                            <li>Create, manage, and customize your forms with ease</li>
                            <li>Drag and drop form elements</li>
                            <li>Customize field properties</li>
                            <li>Preview and test your forms</li>
                            <li>Save and load forms</li>
                        </ul>
                    </li>
                </ul>
                <p>This system will host all of the tools we create for HostMason customers. More tools will be added in the future.</p>
                <p>Get started by selecting a tool from the sidebar menu.</p>
            </div>
        `;
    }
}
