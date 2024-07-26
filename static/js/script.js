import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';

let formFields = [];
let selectedField = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    FormModule.loadSavedForms();
    showLandingPage();
});

function showLandingPage() {
    document.title = "Welcome - BlueColar Form Builder";
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('form-builder').style.display = 'none';
}

function showFormBuilder() {
    document.title = "Form Builder - BlueColar";
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('form-builder').style.display = 'block';
}

function initializeEventListeners() {
    document.querySelectorAll('.field-type-button').forEach(button => {
        button.setAttribute('draggable', 'true');
        button.addEventListener('dragstart', dragStart);
        button.addEventListener('dragend', dragEnd);
        button.addEventListener('click', addField);
    });

    document.getElementById('previewFormBtn').addEventListener('click', previewForm);
    document.getElementById('submitPreviewFormBtn').addEventListener('click', UIModule.submitPreviewForm);

    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', toggleSidebar);

    document.querySelectorAll('.nav-section-btn').forEach(btn => {
        btn.addEventListener('click', toggleSection);
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavItemClick);
    });

    // Add event listeners for form actions
    document.getElementById('createFormBtn').addEventListener('click', createNewForm);
    document.getElementById('loadFormBtn').addEventListener('click', loadForm);
    document.getElementById('saveFormBtn').addEventListener('click', saveForm);
    document.getElementById('deleteFormBtn').addEventListener('click', deleteForm);

    // Initialize sidebar state
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    document.getElementById('fieldLabel').addEventListener('input', (e) => updateFieldProperty('label', e.target.value));
    document.getElementById('fieldPlaceholder').addEventListener('input', (e) => updateFieldProperty('placeholder', e.target.value));
    document.getElementById('fieldRequired').addEventListener('change', (e) => updateFieldProperty('required', e.target.checked));
    document.getElementById('fieldOptionsText').addEventListener('input', (e) => updateFieldProperty('options', e.target.value));
    document.getElementById('addOptionBtn').addEventListener('click', FieldModule.addSelectOption);

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

    document.querySelector('.close').onclick = UIModule.closeModal;

    window.onclick = function(event) {
        const modal = document.getElementById('preview-modal');
        if (event.target == modal) {
            UIModule.closeModal();
        }
    };
}

function createNewForm() {
    formFields = [];
    updateFormFields(formFields);
    updatePageTitle('New Form');
}

function loadForm() {
    FormModule.loadForm(updateFormFields);
}

function saveForm() {
    FormModule.saveForm(formFields);
}

function deleteForm() {
    const formName = document.getElementById('form-list').value;
    if (formName) {
        FormModule.deleteForm(formName);
        createNewForm();
    } else {
        alert('Please select a form to delete.');
    }
}

function openCustomFields() {
    console.log('Open custom fields');
}

function openTemplates() {
    console.log('Open templates');
}

function openPreferences() {
    console.log('Open preferences');
}

function openHelp() {
    console.log('Open help');
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
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
}

function dragEnter(e) {
    e.preventDefault();
    if (e.target.closest('.form-field-container')) {
        e.target.closest('.form-field-container').classList.add('drag-over');
    }
}

function dragLeave(e) {
    if (e.target.closest('.form-field-container')) {
        e.target.closest('.form-field-container').classList.remove('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.classList.remove('drag-over');

    const fieldType = e.dataTransfer.getData('text/plain');
    const fieldElement = FieldModule.createField(fieldType);
    if (fieldElement) {
        fieldElement.draggable = true;
        fieldElement.addEventListener('dragstart', dragStart);
        fieldElement.addEventListener('dragend', dragEnd);
        fieldElement.addEventListener('click', () => selectField(fieldElement));

        formFieldContainer.appendChild(fieldElement);
        formFields.push(fieldElement);
        updateHierarchyView();

        const placeholder = formFieldContainer.querySelector('.drag-placeholder');
        if (placeholder) {
            formFieldContainer.removeChild(placeholder);
        }
    } else {
        console.error('Failed to create field element for type:', fieldType);
    }
}

function addField(e, fieldType) {
    if (e && e.type === 'click') {
        e.preventDefault();
        fieldType = e.currentTarget.getAttribute('data-field-type');
    }
    const fieldElement = FieldModule.createField(fieldType);
    if (fieldElement) {
        fieldElement.draggable = true;
        fieldElement.addEventListener('dragstart', dragStart);
        fieldElement.addEventListener('dragend', dragEnd);
        fieldElement.addEventListener('click', () => selectField(fieldElement));

        const formFieldContainer = document.getElementById('preview-content');
        formFieldContainer.appendChild(fieldElement);
        formFields.push(fieldElement);
        updateHierarchyView();

        const placeholder = formFieldContainer.querySelector('.drag-placeholder');
        if (placeholder) {
            formFieldContainer.removeChild(placeholder);
        }
    } else {
        console.error('Failed to create field element for type:', fieldType);
    }
}

function updateHierarchyView() {
    const formFieldContainer = document.getElementById('preview-content');
    formFields = Array.from(formFieldContainer.children);
}

function selectField(field) {
    selectedField = field;
    FieldModule.updateFieldProperties(field);
    document.querySelectorAll('.form-field').forEach(f => f.classList.remove('selected'));
    field.classList.add('selected');
    document.querySelector('.field-properties').style.display = 'block';
}

function updateFieldProperty(property, value) {
    if (selectedField) {
        FieldModule.updateField(selectedField, property, value);
        updateHierarchyView();
    }
}

function updateFormFields(loadedFields) {
    formFields = loadedFields;
    const formFieldContainer = document.getElementById('preview-content');
    formFieldContainer.innerHTML = '';
    formFields.forEach(field => {
        formFieldContainer.appendChild(field);
    });
    updateHierarchyView();
}

function toggleSection(e) {
    const sectionId = e.currentTarget.id.replace('Btn', 'Section');
    const section = document.getElementById(sectionId);
    document.querySelectorAll('.nav-section-content').forEach(content => {
        if (content.id !== sectionId) {
            content.classList.remove('expanded');
        }
    });
    section.classList.toggle('expanded');
}

function handleNavItemClick(e) {
    const action = e.currentTarget.id;
    switch (action) {
        case 'formBuilderBtn':
            showFormBuilder();
            break;
        case 'createFormBtn':
            createNewForm();
            break;
        case 'loadFormBtn':
            loadForm();
            break;
        case 'saveFormBtn':
            saveForm();
            break;
        case 'deleteFormBtn':
            deleteForm();
            break;
        case 'customFieldsBtn':
            openCustomFields();
            break;
        case 'templatesBtn':
            openTemplates();
            break;
        case 'preferencesBtn':
            openPreferences();
            break;
        case 'helpBtn':
            openHelp();
            break;
    }
}

function updatePageTitle(title) {
    document.title = `${title} - BlueColar Form Builder`;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save sidebar state
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

export { formFields, selectedField, updateFormFields };
