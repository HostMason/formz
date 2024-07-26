import { FormBuilder } from '../formBuilder.js';

const formBuilder = {
    init() {
        console.log('Form Builder initialized');
        this.formBuilder = new FormBuilder();
        this.formBuilder.initialize();
        this.renderFormBuilder();
        this.attachEventListeners();
    },

    renderFormBuilder() {
        const formBuilderHTML = `
            <h2>Form Builder</h2>
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
        document.getElementById('toolbox-content').innerHTML = formBuilderHTML;
    },

    attachEventListeners() {
        document.getElementById('preview-form-btn')?.addEventListener('click', () => this.formBuilder.previewForm());
        document.getElementById('save-form-btn')?.addEventListener('click', () => this.formBuilder.saveForm());
        document.getElementById('form-list')?.addEventListener('change', (e) => this.formBuilder.loadForm(e.target.value));
        document.getElementById('create-form-btn')?.addEventListener('click', () => this.formBuilder.createNewForm());
        
        document.querySelectorAll('.field-type-button').forEach(button => {
            button.addEventListener('click', (e) => this.formBuilder.addField(e.target.dataset.type));
        });
    }
};

export default formBuilder;
