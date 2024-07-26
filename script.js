import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';

let formFields = [];

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    let fieldElement;

    switch (data) {
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
    event.target.appendChild(fieldElement);
    formFields.push(fieldElement);
}

// Load saved forms on page load
window.onload = function() {
    FormModule.loadSavedForms();

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

    document.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            UIModule.showMenuPanel(target);
        });
    });

    // Create the Estimate Options panel
    const estimateOptionsPanel = document.createElement('div');
    estimateOptionsPanel.id = 'estimate-options';
    estimateOptionsPanel.className = 'menu-panel';
    estimateOptionsPanel.innerHTML = '<h2>Estimate Options</h2><p>Estimate options will be added here.</p>';
    document.querySelector('.flex-container').appendChild(estimateOptionsPanel);

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
window.allowDrop = allowDrop;
window.drag = drag;
window.drop = drop;
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
