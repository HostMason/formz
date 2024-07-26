import { UISystem } from './uiSystem.js';
import { FormBuilder } from './formBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const uiSystem = new UISystem();
    const formBuilder = new FormBuilder();

    initializeEventListeners(uiSystem, formBuilder);
});

function initializeEventListeners(uiSystem, formBuilder) {
    document.getElementById('saveFormBtn').addEventListener('click', () => formBuilder.saveForm());
    document.getElementById('previewFormBtn').addEventListener('click', () => formBuilder.previewForm());
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleNavItemClick(e, uiSystem, formBuilder));
    });

    // Close button for preview modal
    document.querySelector('#preview-modal .close').addEventListener('click', () => {
        document.getElementById('preview-modal').style.display = 'none';
    });
}

function handleNavItemClick(e, uiSystem, formBuilder) {
    const action = e.currentTarget.id;
    switch (action) {
        case 'formBuilderBtn':
            uiSystem.showPage('formBuilder');
            break;
        case 'loadFormBtn':
            // Implement load form functionality
            console.log('Load form clicked');
            break;
        case 'saveFormBtn':
            formBuilder.saveForm();
            break;
        case 'deleteFormBtn':
            // Implement delete form functionality
            console.log('Delete form clicked');
            break;
        case 'customFieldsBtn':
            uiSystem.showPage('customFields');
            break;
        case 'templatesBtn':
            uiSystem.showPage('templates');
            break;
        case 'helpBtn':
            uiSystem.showPage('help');
            break;
        case 'settingsBtn':
            uiSystem.showPage('settings');
            break;
        case 'toolboxBtn':
            uiSystem.toggleToolbox();
            break;
        default:
            uiSystem.showPage('landing');
            break;
    }
}
