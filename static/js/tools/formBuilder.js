import { Tool } from './baseTool.js';
import { FormBuilder } from '../formBuilder.js';

class FormBuilderTool extends Tool {
    constructor() {
        super('formBuilder', 'Form Builder', 'fas fa-wpforms');
        this.formBuilder = new FormBuilder();
    }

    init() {
        super.init();
        this.formBuilder.initialize();
    }

    render() {
        return `
            <h2>${this.name}</h2>
            <div id="form-builder-container">
                <div id="form-controls">
                    <button id="create-form-btn">Create New Form</button>
                    <select id="form-list">
                        <option value="">Select a form</option>
                    </select>
                    <button id="save-form-btn">Save Form</button>
                    <button id="preview-form-btn">Preview Form</button>
                </div>
                <div id="form-editor">
                    <div id="field-types">
                        <button class="field-type-button" data-type="text">Text Input</button>
                        <button class="field-type-button" data-type="number">Number Input</button>
                        <button class="field-type-button" data-type="checkbox">Checkbox</button>
                        <button class="field-type-button" data-type="radio">Radio Button</button>
                        <button class="field-type-button" data-type="select">Dropdown</button>
                    </div>
                    <div id="preview-content"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.getElementById('preview-form-btn')?.addEventListener('click', () => this.formBuilder.previewForm());
        document.getElementById('save-form-btn')?.addEventListener('click', () => this.formBuilder.saveForm());
        document.getElementById('form-list')?.addEventListener('change', (e) => this.formBuilder.loadForm(e.target.value));
        document.getElementById('create-form-btn')?.addEventListener('click', () => this.formBuilder.createNewForm());
        
        document.querySelectorAll('.field-type-button').forEach(button => {
            button.addEventListener('click', (e) => this.formBuilder.addField(e.target.dataset.type));
        });
    }
}

export default new FormBuilderTool();
