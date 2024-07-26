import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';

// Register modules
moduleManager.registerModule('form', FormModule);
moduleManager.registerModule('field', FieldModule);
moduleManager.registerModule('ui', UIModule);

let formFields = [];

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function updateFormPreview() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = '';

    formFields.forEach(field => {
        const previewField = field.cloneNode(true);
        previewField.removeAttribute('onclick');
        previewField.querySelectorAll('input, textarea, select').forEach(input => {
            input.removeAttribute('disabled');
        });
        previewContent.appendChild(previewField);
    });
}

function addFieldToPreview(fieldType) {
    const newField = addField(fieldType);
    formFields.push(newField);
    updateFormPreview();
}

function addField(fieldType) {
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
            fieldElement = document.createElement('textarea');
            fieldElement.placeholder = 'Enter text';
            break;
        case 'button':
            fieldElement = document.createElement('button');
            fieldElement.innerText = 'Click Me';
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

    fieldElement.className = 'form-field';
    fieldElement.onclick = function() {
        FieldModule.selectField(fieldElement);
    };
    formFields.push(fieldElement);
    updateFormPreview();
}

// Load saved forms on page load
window.onload = function() {
    moduleManager.initializeAllModules();

    // Side menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const container = document.querySelector('.container');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            console.log('Menu toggle clicked'); // Debug log
            sideMenu.classList.toggle('open');
            if (sideMenu.classList.contains('open')) {
                container.style.marginLeft = '250px';
            } else {
                container.style.marginLeft = '50px';
            }
        });
    } else {
        console.error('Menu toggle element not found'); // Debug log
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
window.addField = addFieldToPreview;
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
