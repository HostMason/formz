import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';

// Register modules
moduleManager.registerModule('form', FormModule);
moduleManager.registerModule('field', FieldModule);
moduleManager.registerModule('ui', UIModule);

let formFields = [];

function updateFormPreview() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = '';

    formFields.forEach((field, index) => {
        const previewField = field.cloneNode(true);
        previewField.removeAttribute('onclick');
        previewField.querySelectorAll('input, textarea, select').forEach(input => {
            input.removeAttribute('disabled');
        });
        previewField.draggable = true;
        previewField.id = `preview-field-${index}`;
        previewField.ondragstart = drag;
        previewField.ondragover = allowDrop;
        previewField.ondrop = drop;
        previewContent.appendChild(previewField);
    });
}

function addFieldToPreview(fieldType) {
    let fieldElement;

    switch (fieldType) {
        case 'text-input':
            fieldElement = FieldModule.createInputField('text', 'Enter text');
            break;
        case 'number-input':
            fieldElement = FieldModule.createInputField('number', 'Enter number');
            break;
        case 'email-input':
            fieldElement = FieldModule.createInputField('email', 'Enter email');
            break;
        case 'textarea':
            fieldElement = document.createElement('div');
            fieldElement.className = 'form-field';
            fieldElement.innerHTML = '<label>Textarea:</label><textarea placeholder="Enter text"></textarea>';
            break;
        case 'button':
            fieldElement = document.createElement('div');
            fieldElement.className = 'form-field';
            fieldElement.innerHTML = '<button>Click Me</button>';
            break;
        case 'radio-button':
            fieldElement = FieldModule.createOptionField('radio');
            break;
        case 'checkbox':
            fieldElement = FieldModule.createOptionField('checkbox');
            break;
        case 'select-dropdown':
            fieldElement = FieldModule.createSelectField();
            break;
    }

    fieldElement.draggable = true;
    fieldElement.ondragstart = drag;
    fieldElement.ondragend = dragEnd;
    fieldElement.ondragover = allowDrop;
    fieldElement.ondrop = drop;
    fieldElement.onclick = function() {
        FieldModule.selectField(fieldElement);
    };
    formFields.push(fieldElement);
    updateFormPreview();
}

let draggedElement = null;
let dropTarget = null;

function drag(ev) {
    draggedElement = ev.target;
    ev.dataTransfer.setData("text", ev.target.id);
    setTimeout(() => {
        draggedElement.classList.add('dragging');
    }, 0);
}

function allowDrop(ev) {
    ev.preventDefault();
    if (draggedElement && ev.target.classList.contains('form-field') && ev.target !== draggedElement) {
        const rect = ev.target.getBoundingClientRect();
        const dropPosition = (ev.clientY - rect.top) / (rect.bottom - rect.top);

        if (dropPosition < 0.5) {
            ev.target.classList.remove('shift-down');
            ev.target.classList.add('shift-up');
        } else {
            ev.target.classList.remove('shift-up');
            ev.target.classList.add('shift-down');
        }
        dropTarget = ev.target;
    }
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const dropzone = document.getElementById('preview-content');

    if (dropTarget && dropTarget !== draggedElement && dropzone.contains(dropTarget)) {
        const rect = dropTarget.getBoundingClientRect();
        const dropPosition = (ev.clientY - rect.top) / (rect.bottom - rect.top);

        if (dropPosition < 0.5) {
            dropzone.insertBefore(draggedElement, dropTarget);
        } else {
            dropzone.insertBefore(draggedElement, dropTarget.nextSibling);
        }

        updateFormFieldsOrder();
    }

    // Reset styles and classes
    draggedElement.classList.remove('dragging');
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('shift-up', 'shift-down');
    });

    draggedElement = null;
    dropTarget = null;
}

function dragEnd(ev) {
    ev.target.classList.remove('dragging');
    document.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('shift-up', 'shift-down');
    });
}

function updateFormFieldsOrder() {
    const previewContent = document.getElementById('preview-content');
    formFields = Array.from(previewContent.children);
}

// Add event listeners for drag and drop
document.getElementById('preview-content').ondrop = drop;
document.getElementById('preview-content').ondragover = allowDrop;

// Load saved forms on page load
window.onload = function() {
    FormModule.loadSavedForms();

    // Side menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const container = document.querySelector('.container');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sideMenu.classList.toggle('open');
            if (sideMenu.classList.contains('open')) {
                container.style.marginLeft = '250px';
            } else {
                container.style.marginLeft = '50px';
            }
        });
    }

    document.querySelectorAll('.menu-option, .submenu-option').forEach(option => {
        option.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target === 'creator-tools') {
                document.getElementById('creator-tools-submenu').classList.toggle('show');
            } else {
                UIModule.showMenuPanel(target);
            }
        });
    });

    // Close modal when clicking on <span> (x)
    document.querySelector('.close').onclick = UIModule.closeModal;

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('preview-modal');
        if (event.target == modal) {
            UIModule.closeModal();
        }
    }
}

// Expose necessary functions to the global scope for HTML event handlers
window.addFieldToPreview = addFieldToPreview;
window.previewForm = UIModule.previewForm;
window.submitPreviewForm = UIModule.submitPreviewForm;
window.saveForm = FormModule.saveForm;
window.loadForm = FormModule.loadForm;
window.deleteForm = FormModule.deleteForm;
window.updateFieldLabel = FieldModule.updateFieldLabel;
window.updateFieldPlaceholder = FieldModule.updateFieldPlaceholder;
window.updateFieldRequired = FieldModule.updateFieldRequired;
window.updateFieldValue = FieldModule.updateFieldValue;
window.updateSelectOptions = FieldModule.updateSelectOptions;
window.addSelectOption = FieldModule.addSelectOption;
window.updateFieldStyle = FieldModule.updateFieldStyle;
window.selectField = FieldModule.selectField;
