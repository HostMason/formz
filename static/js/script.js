import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';
import * as SidebarModule from './sidebarModule.js';

// Register modules
moduleManager.registerModule('form', FormModule);
moduleManager.registerModule('field', FieldModule);
moduleManager.registerModule('ui', UIModule);
moduleManager.registerModule('sidebar', SidebarModule);

let formFields = [];
let selectedField = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeModules();
    initializeEventListeners();
    FormModule.loadSavedForms();
    showFormBuilder(); // Show Form Builder by default
});

function showFormBuilder() {
    document.title = "Form Builder - BlueColar";
    // Add logic to show the form builder content
}

function initializeModules() {
    moduleManager.initializeAllModules();
    SidebarModule.initializeSidebarButtons();
}

function initializeEventListeners() {
    document.querySelectorAll('.field-type-button').forEach(button => {
        button.addEventListener('dragstart', dragStart);
        button.addEventListener('dragend', dragEnd);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const fieldType = e.target.getAttribute('data-field-type');
            const fieldElement = FieldModule.createField(fieldType);
            const formFieldContainer = document.getElementById('preview-content');
            formFieldContainer.appendChild(fieldElement);
            formFields.push(fieldElement);
            updateHierarchyView();
        });
    });

    document.querySelectorAll('.nav-section.expandable h2').forEach(header => {
        header.addEventListener('click', toggleSection);
    });

    document.getElementById('formBuilderBtn').addEventListener('click', showFormBuilder);

    document.getElementById('fieldLabel').addEventListener('input', (e) => updateFieldProperty('label', e.target.value));
    document.getElementById('fieldPlaceholder').addEventListener('input', (e) => updateFieldProperty('placeholder', e.target.value));
    document.getElementById('fieldRequired').addEventListener('change', (e) => updateFieldProperty('required', e.target.checked));
    document.getElementById('fieldOptionsText').addEventListener('input', (e) => updateFieldProperty('options', e.target.value));
    document.getElementById('addOptionBtn').addEventListener('click', FieldModule.addSelectOption);

    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.addEventListener('dragover', dragOver);
    formFieldContainer.addEventListener('dragenter', dragEnter);
    formFieldContainer.addEventListener('dragleave', dragLeave);
    formFieldContainer.addEventListener('drop', drop);

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
    if (e.target.classList.contains('form-field-container')) {
        e.target.classList.add('drag-over');
    }
}

function dragLeave(e) {
    if (e.target.classList.contains('form-field-container')) {
        e.target.classList.remove('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.classList.remove('drag-over');

    const fieldType = e.dataTransfer.getData('text');
    const fieldElement = FieldModule.createField(fieldType);
    fieldElement.draggable = true;
    fieldElement.addEventListener('dragstart', dragStart);
    fieldElement.addEventListener('dragend', dragEnd);
    fieldElement.addEventListener('click', () => selectField(fieldElement));

    formFieldContainer.appendChild(fieldElement);
    formFields.push(fieldElement);
    updateHierarchyView();

    // Remove the placeholder text if it exists
    const placeholder = formFieldContainer.querySelector('.drag-placeholder');
    if (placeholder) {
        formFieldContainer.removeChild(placeholder);
    }
}

function updateHierarchyView() {
    const formFieldContainer = document.getElementById('preview-content');
    formFields = Array.from(formFieldContainer.children);
    // Update hierarchy view if needed
}

function selectField(field) {
    selectedField = field;
    FieldModule.updateFieldProperties(field);
    document.querySelectorAll('.form-field').forEach(f => f.classList.remove('selected'));
    field.classList.add('selected');

    // Show the field properties section
    document.querySelector('.field-properties').style.display = 'block';

    // Prevent default behavior and stop event propagation
    event.preventDefault();
    event.stopPropagation();
}

function updateFieldProperty(property, value) {
    if (selectedField) {
        FieldModule.updateField(selectedField, property, value);
        updateHierarchyView();
    }
}

export function updateFormFields(loadedFields) {
    formFields = loadedFields;
    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.innerHTML = '';
    formFields.forEach(field => {
        formFieldContainer.appendChild(field);
    });
    updateHierarchyView();
}

export { formFields, selectedField };
function toggleSection(event) {
    const section = event.target.closest('.nav-section');
    section.classList.toggle('expanded');
}

function updatePageTitle(title) {
    document.title = `${title} - BlueColar`;
}
