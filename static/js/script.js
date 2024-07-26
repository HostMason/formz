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
        button.addEventListener('click', () => {
            const fieldType = button.getAttribute('data-field-type');
            addFieldToPreview(fieldType);
        });
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

    document.getElementById('prevBtn').addEventListener('click', () => navigateForm(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navigateForm(1));
    document.getElementById('submitBtn').addEventListener('click', submitForm);

    // Side menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const container = document.querySelector('.container');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        container.style.marginLeft = sideMenu.classList.contains('open') ? '250px' : '60px';
    });

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
    };

    // Initialize drag and drop
    const previewContent = document.getElementById('preview-content');
    previewContent.addEventListener('dragover', allowDrop);
    previewContent.addEventListener('drop', drop);
}

function addFieldToPreview(fieldType) {
    const fieldElement = FieldModule.createField(fieldType);
    fieldElement.draggable = true;
    fieldElement.addEventListener('dragstart', drag);
    fieldElement.addEventListener('click', () => selectField(fieldElement));
    formFields.push(fieldElement);
    updateFormPreview();
    updateHierarchyView();
}

function updateFormPreview() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = '';
    formFields.forEach(field => previewContent.appendChild(field.cloneNode(true)));
}

function updateHierarchyView() {
    const hierarchyList = document.getElementById('hierarchy-list');
    hierarchyList.innerHTML = '';
    formFields.forEach((field, index) => {
        const li = document.createElement('li');
        li.textContent = field.querySelector('label').textContent || `Field ${index + 1}`;
        li.addEventListener('click', () => selectField(field));
        hierarchyList.appendChild(li);
    });
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

    UIModule.showMenuPanel('field-properties');
}

function updateFieldProperty(property, value) {
    if (selectedField) {
        FieldModule.updateField(selectedField, property, value);
        updateFormPreview();
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

let draggedElement = null;

function drag(ev) {
    draggedElement = ev.target;
    ev.dataTransfer.setData('text/plain', '');
    setTimeout(() => draggedElement.classList.add('dragging'), 0);
}

function allowDrop(ev) {
    ev.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
        const closestElement = getClosestElement(ev.clientY);
        if (closestElement) {
            closestElement.classList.add('drag-over');
        }
    }
}

function getClosestElement(y) {
    const draggableElements = [...document.querySelectorAll('.form-field:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function drop(ev) {
    ev.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
        const closestElement = getClosestElement(ev.clientY);
        if (closestElement) {
            closestElement.parentNode.insertBefore(draggingElement, closestElement);
        } else {
            ev.target.appendChild(draggingElement);
        }
        draggingElement.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        updateFormFieldsOrder();
    }
}

function updateFormFieldsOrder() {
    const previewContent = document.getElementById('preview-content');
    formFields = Array.from(previewContent.children);
    updateHierarchyView();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    FormModule.loadSavedForms();
});
