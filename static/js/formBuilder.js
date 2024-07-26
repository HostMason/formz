export class FormBuilder {
    constructor() {
        this.formFields = null;
        this.fieldTypes = null;
    }

    initialize() {
        this.formFields = document.getElementById('preview-content');
        this.fieldTypes = document.querySelectorAll('.field-type-button');
        
        if (this.formFields && this.fieldTypes.length > 0) {
            this.initializeEventListeners();
        } else {
            console.error('Form fields container or field types not found');
        }
    }

    initializeEventListeners() {
        this.fieldTypes.forEach(fieldType => {
            fieldType.addEventListener('dragstart', this.dragStart.bind(this));
            fieldType.addEventListener('dragend', this.dragEnd.bind(this));
        });

        this.formFields.addEventListener('dragover', this.dragOver.bind(this));
        this.formFields.addEventListener('drop', this.drop.bind(this));
    }

    dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-field-type'));
        e.target.style.opacity = '0.5';
    }

    dragEnd(e) {
        e.target.style.opacity = '1';
    }

    dragOver(e) {
        e.preventDefault();
    }

    drop(e) {
        e.preventDefault();
        const fieldType = e.dataTransfer.getData('text');
        const newField = this.createField(fieldType);
        e.target.appendChild(newField);
    }

    createField(type) {
        const field = document.createElement('div');
        field.className = 'form-field';
        field.innerHTML = `<label>${this.capitalizeFirstLetter(type)}:</label>`;
        
        const input = this.createInputElement(type);
        field.appendChild(input);
        return field;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    createInputElement(type) {
        switch(type) {
            case 'text-input':
            case 'number-input':
            case 'email-input':
                return this.createBasicInput(type.split('-')[0]);
            case 'textarea':
                return document.createElement('textarea');
            case 'checkbox':
            case 'radio-button':
                return this.createCheckboxOrRadio(type);
            case 'select-dropdown':
                return this.createSelectDropdown();
            case 'button':
                return this.createButton();
            default:
                console.warn(`Unknown field type: ${type}`);
                return document.createElement('input');
        }
    }

    createBasicInput(type) {
        const input = document.createElement('input');
        input.type = type;
        return input;
    }

    createCheckboxOrRadio(type) {
        const input = document.createElement('input');
        input.type = type === 'radio-button' ? 'radio' : 'checkbox';
        return input;
    }

    createSelectDropdown() {
        const select = document.createElement('select');
        select.innerHTML = '<option>Option 1</option><option>Option 2</option>';
        return select;
    }

    createButton() {
        const button = document.createElement('button');
        button.textContent = 'Button';
        return button;
    }

    saveForm() {
        const formData = Array.from(this.formFields.children).map(field => ({
            type: field.querySelector('input, textarea, select, button').tagName.toLowerCase(),
            label: field.querySelector('label').textContent
        }));
        console.log('Form saved:', formData);
        // Here you would typically send this data to a server
    }

    previewForm() {
        const previewModal = document.getElementById('preview-modal');
        const previewForm = document.getElementById('preview-form');
        previewForm.innerHTML = '';

        this.formFields.childNodes.forEach(field => {
            previewForm.appendChild(field.cloneNode(true));
        });

        previewModal.style.display = 'block';
    }
}
