export class FormBuilder {
    constructor() {
        this.formFields = document.getElementById('preview-content');
        this.fieldTypes = document.querySelectorAll('.field-type-button');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.fieldTypes.forEach(fieldType => {
            fieldType.addEventListener('dragstart', this.dragStart.bind(this));
            fieldType.addEventListener('dragend', this.dragEnd.bind(this));
        });

        if (this.formFields) {
            this.formFields.addEventListener('dragover', this.dragOver.bind(this));
            this.formFields.addEventListener('drop', this.drop.bind(this));
        } else {
            console.error('Form fields container not found');
        }
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
        field.innerHTML = `<label>${type.charAt(0).toUpperCase() + type.slice(1)}:</label>`;
        
        let input;
        switch(type) {
            case 'text-input':
            case 'number-input':
            case 'email-input':
                input = document.createElement('input');
                input.type = type.split('-')[0];
                break;
            case 'textarea':
                input = document.createElement('textarea');
                break;
            case 'checkbox':
            case 'radio-button':
                input = document.createElement('input');
                input.type = type === 'radio-button' ? 'radio' : 'checkbox';
                break;
            case 'select-dropdown':
                input = document.createElement('select');
                input.innerHTML = '<option>Option 1</option><option>Option 2</option>';
                break;
            case 'button':
                input = document.createElement('button');
                input.textContent = 'Button';
                break;
        }
        
        field.appendChild(input);
        return field;
    }

    saveForm() {
        const formData = Array.from(this.formFields.children).map(field => {
            return {
                type: field.querySelector('input, textarea, select, button').tagName.toLowerCase(),
                label: field.querySelector('label').textContent
            };
        });
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
