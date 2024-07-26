import Component from './Component.js';

export default class CreateForm extends Component {
    render() {
        return `
            <div id="createForm-page" class="page">
                <h1>Create New Form</h1>
                <div class="form-builder">
                    <div class="field-types">
                        <h2>Field Types</h2>
                        <button class="field-type" data-type="text">Text Input</button>
                        <button class="field-type" data-type="number">Number Input</button>
                        <button class="field-type" data-type="email">Email Input</button>
                        <button class="field-type" data-type="textarea">Text Area</button>
                        <button class="field-type" data-type="checkbox">Checkbox</button>
                        <button class="field-type" data-type="radio">Radio Button</button>
                        <button class="field-type" data-type="select">Dropdown</button>
                    </div>
                    <div class="form-preview">
                        <h2>Form Preview</h2>
                        <div id="form-fields"></div>
                    </div>
                    <div class="field-properties">
                        <h2>Field Properties</h2>
                        <div id="field-properties-form"></div>
                    </div>
                </div>
                <button id="save-form">Save Form</button>
            </div>
        `;
    }

    afterRender() {
        // Add drag-and-drop functionality
        // Implement field property editing
        // Implement form saving
    }
}
