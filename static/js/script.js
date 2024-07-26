import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as FieldModule from './fieldModule.js';
import * as UIModule from './uiModule.js';
import { UISystem } from './uiSystem.js';

let formFields = [];
let selectedField = null;
let uiSystem;

document.addEventListener('DOMContentLoaded', () => {
    uiSystem = new UISystem();
    initializeEventListeners();
    FormModule.loadSavedForms();
    uiSystem.showPage('landing');
});

function initializeEventListeners() {
    document.querySelectorAll('.field-type-button').forEach(button => {
        button.setAttribute('draggable', 'true');
        button.addEventListener('dragstart', dragStart);
        button.addEventListener('dragend', dragEnd);
        button.addEventListener('click', addField);
    });

    document.getElementById('previewFormBtn').addEventListener('click', () => UIModule.previewForm(formFields));
    document.getElementById('submitPreviewFormBtn').addEventListener('click', UIModule.submitPreviewForm);

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
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('form-builder').style.display = 'block';
    document.querySelector('.main-content').innerHTML = document.getElementById('helpPage').innerHTML;
    updatePageTitle('Help');
}

function openCustomFields() {
    console.log('Open custom fields');
}

function openTemplates() {
    console.log('Open templates');
}

function openSettings() {
    console.log('Open settings');
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

function toggleSubmenu(e) {
    const submenu = e.currentTarget.nextElementSibling;
    if (submenu && submenu.classList.contains('submenu')) {
        submenu.classList.toggle('expanded');
        e.currentTarget.classList.toggle('active');
    }
}

function handleNavItemClick(e) {
    const action = e.currentTarget.id;

    // If the clicked item has a submenu, toggle it
    if (e.currentTarget.nextElementSibling && e.currentTarget.nextElementSibling.classList.contains('submenu')) {
        toggleSubmenu(e);
        return;
    }

    switch (action) {
        case 'formBuilderBtn':
            showPage('formBuilder');
            break;
        case 'loadFormBtn':
            loadForm();
            showPage('formBuilder');
            break;
        case 'saveFormBtn':
            saveForm();
            showPage('formBuilder');
            break;
        case 'deleteFormBtn':
            deleteForm();
            showPage('formBuilder');
            break;
        case 'customFieldsBtn':
            showPage('customFields');
            break;
        case 'templatesBtn':
            showPage('templates');
            break;
        case 'settingsBtn':
            showPage('settings');
            break;
        case 'helpBtn':
            showPage('help');
            break;
        default:
            showPage('landing');
            break;
    }

    // Highlight the active menu item
    document.querySelectorAll('.nav-btn').forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Close the sidebar on mobile after a menu item is clicked
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function initializeEventListeners() {
    // ... (keep existing code)

    // Add event listeners for nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavItemClick);
    });

    // Add event listener for HostMason logo
    document.getElementById('hostMasonLogo').addEventListener('click', () => showPage('landing'));
}

function updatePageTitle(title) {
    document.title = `${title} - BlueColar Form Builder`;
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
}

function showPage(pageId) {
    hideAllPages();
    const page = document.getElementById(`${pageId}-page`);
    if (page) {
        page.style.display = 'block';
        updatePageTitle(pageId.charAt(0).toUpperCase() + pageId.slice(1));
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save sidebar state
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));

    // Update menu toggle icon
    updateMenuToggleIcon();
}

function updateMenuToggleIcon() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle i');
    if (sidebar.classList.contains('collapsed')) {
        menuToggle.classList.remove('fa-arrow-left');
        menuToggle.classList.add('fa-arrow-right');
    } else {
        menuToggle.classList.remove('fa-arrow-right');
        menuToggle.classList.add('fa-arrow-left');
    }
}

function handleNavItemClick(e) {
    const action = e.currentTarget.id;
    switch (action) {
        case 'toolboxBtn':
            uiSystem.toggleToolbox();
            break;
        case 'formBuilderBtn':
            showPage('formBuilder');
            break;
        case 'loadFormBtn':
            showPage('loadForm');
            break;
        case 'helpBtn':
            showPage('help');
            break;
        case 'settingsBtn':
            showPage('settings');
            break;
        default:
            showPage('landing');
            break;
    }
}

export { formFields, selectedField, updateFormFields };
