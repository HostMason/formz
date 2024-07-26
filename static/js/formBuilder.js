export class FormBuilder {
    constructor() {
        this.formFields = null;
        this.fieldTypes = null;
        this.currentForm = null;
        this.formList = [];
    }

    initialize() {
        this.formFields = document.getElementById('preview-content');
        this.fieldTypes = document.querySelectorAll('.field-type-button');
        this.initializeEventListeners();
        this.renderFormBuilder();
    }

    initializeEventListeners() {
        document.getElementById('create-form-btn').addEventListener('click', () => this.createNewForm());
        document.getElementById('save-form-btn').addEventListener('click', () => this.saveForm());
        document.getElementById('preview-form-btn').addEventListener('click', () => this.previewForm());
        document.getElementById('form-list').addEventListener('change', (e) => this.loadForm(e.target.value));

        this.fieldTypes.forEach(fieldType => {
            fieldType.addEventListener('dragstart', this.dragStart.bind(this));
            fieldType.addEventListener('dragend', this.dragEnd.bind(this));
        });

        this.formFields.addEventListener('dragover', this.dragOver.bind(this));
        this.formFields.addEventListener('drop', this.drop.bind(this));
    }

    renderFormBuilder() {
        const formBuilderHTML = `
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
                        <!-- Add draggable field type buttons here -->
                    </div>
                    <div id="preview-content"></div>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = formBuilderHTML;
        this.updateFormList();
    }

    createNewForm() {
        const formName = prompt('Enter a name for the new form:');
        if (formName) {
            this.currentForm = { name: formName, fields: [] };
            this.formFields.innerHTML = '';
            this.updateFormList();
        }
    }

    updateFormList() {
        const formList = document.getElementById('form-list');
        formList.innerHTML = '<option value="">Select a form</option>';
        this.formList.forEach(form => {
            const option = document.createElement('option');
            option.value = form.name;
            option.textContent = form.name;
            formList.appendChild(option);
        });
    }

    loadForm(formName) {
        this.currentForm = this.formList.find(form => form.name === formName);
        if (this.currentForm) {
            this.formFields.innerHTML = '';
            this.currentForm.fields.forEach(field => {
                const newField = this.createField(field.type);
                newField.querySelector('label').textContent = field.label;
                this.formFields.appendChild(newField);
            });
        }
    }

    saveForm() {
        if (this.currentForm) {
            this.currentForm.fields = Array.from(this.formFields.children).map(field => ({
                type: field.querySelector('input, textarea, select, button').tagName.toLowerCase(),
                label: field.querySelector('label').textContent
            }));
            const existingFormIndex = this.formList.findIndex(form => form.name === this.currentForm.name);
            if (existingFormIndex !== -1) {
                this.formList[existingFormIndex] = this.currentForm;
            } else {
                this.formList.push(this.currentForm);
            }
            this.updateFormList();
            console.log('Form saved:', this.currentForm);
        } else {
            console.error('No form is currently being edited');
        }
    }

    previewForm() {
        if (this.currentForm) {
            const previewWindow = window.open('', 'Form Preview', 'width=600,height=400');
            previewWindow.document.body.innerHTML = `
                <h1>${this.currentForm.name}</h1>
                <form>${this.formFields.innerHTML}</form>
            `;
        } else {
            console.error('No form to preview');
        }
    }

    // ... (keep the existing methods for drag and drop, createField, etc.)
}
