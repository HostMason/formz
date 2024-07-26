import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';

// Register modules
moduleManager.registerModule('form', FormModule);
moduleManager.registerModule('field', FieldModule);
moduleManager.registerModule('ui', UIModule);

let formFields = [];
let selectedField = null;

function initializeEventListeners() {
    document.querySelectorAll('.field-type-button').forEach(button => {
        button.addEventListener('dragstart', dragStart);
        button.addEventListener('dragend', dragEnd);
    });

    document.getElementById('previewFormBtn').addEventListener('click', UIModule.previewForm);
    document.getElementById('saveFormBtn').addEventListener('click', FormModule.saveForm);
    document.getElementById('loadFormBtn').addEventListener('click', FormModule.loadForm);
    document.getElementById('deleteFormBtn').addEventListener('click', FormModule.deleteForm);
    document.getElementById('submitPreviewFormBtn').addEventListener('click', UIModule.submitPreviewForm);

    document.getElementById('fieldLabel').addEventListener('input', (e) => updateFieldProperty('label', e.target.value));
    document.getElementById('fieldPlaceholder').addEventListener('input', (e) => updateFieldProperty('placeholder', e.target.value));
    document.getElementById('fieldRequired').addEventListener('change', (e) => updateFieldProperty('required', e.target.checked));
    document.getElementById('fieldOptionsText').addEventListener('input', (e) => updateFieldProperty('options', e.target.value));
    document.getElementById('addOptionBtn').addEventListener('click', addSelectOption);

    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.addEventListener('dragover', dragOver);
    formFieldContainer.addEventListener('dragenter', dragEnter);
    formFieldContainer.addEventListener('dragleave', dragLeave);
    formFieldContainer.addEventListener('drop', drop);

    // Side menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Close modal when clicking on <span> (x)
    document.querySelector('.close').onclick = UIModule.closeModal;

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('preview-modal');
        if (event.target == modal) {
            UIModule.closeModal();
        }
    };
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-field-type'));
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');

    const fieldType = e.dataTransfer.getData('text');
    const fieldElement = FieldModule.createField(fieldType);
    fieldElement.draggable = true;
    fieldElement.addEventListener('dragstart', dragStart);
    fieldElement.addEventListener('dragend', dragEnd);
    fieldElement.addEventListener('click', () => selectField(fieldElement));

    if (e.target.classList.contains('form-field-container')) {
        e.target.appendChild(fieldElement);
    } else if (e.target.closest('.form-field-container')) {
        e.target.closest('.form-field-container').appendChild(fieldElement);
    }

    formFields.push(fieldElement);
    updateHierarchyView();
}

function updateHierarchyView() {
    const formFieldContainer = document.getElementById('preview-content');
    formFields = Array.from(formFieldContainer.children);
    // Update hierarchy view if needed
}

function selectField(field) {
    selectedField = field;
    updateFieldProperties(field);
    document.querySelectorAll('.form-field').forEach(f => f.classList.remove('selected'));
    field.classList.add('selected');
}

function updateFieldProperties(field) {
    const fieldLabel = document.getElementById('fieldLabel');
    const fieldPlaceholder = document.getElementById('fieldPlaceholder');
    const fieldRequired = document.getElementById('fieldRequired');
    const fieldOptions = document.getElementById('fieldOptions');

    fieldLabel.value = field.querySelector('label').textContent;
    const input = field.querySelector('input, textarea, select');
    fieldPlaceholder.value = input ? input.placeholder : '';
    fieldRequired.checked = input ? input.required : false;

    if (input && input.tagName === 'SELECT') {
        fieldOptions.style.display = 'block';
        const options = Array.from(input.options).map(option => option.text).join('\n');
        document.getElementById('fieldOptionsText').value = options;
    } else {
        fieldOptions.style.display = 'none';
    }
}

function updateFieldProperty(property, value) {
    if (selectedField) {
        FieldModule.updateField(selectedField, property, value);
        updateHierarchyView();
    }
}

function addSelectOption() {
    if (selectedField) {
        const newOption = document.getElementById('newOption').value.trim();
        if (newOption) {
            const select = selectedField.querySelector('select');
            const option = document.createElement('option');
            option.text = newOption;
            option.value = newOption;
            select.add(option);
            document.getElementById('newOption').value = '';
            updateFieldProperties(selectedField);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    FormModule.loadSavedForms();
});
