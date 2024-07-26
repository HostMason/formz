import { moduleManager } from './moduleManager.js';
import * as FormModule from './formModule.js';
import * as UIModule from './uiModule.js';
import { formFields } from './script.js';

export function initializeSidebarButtons() {
    moduleManager.registerSidebarButton('createFormBtn', createNewForm);
    moduleManager.registerSidebarButton('loadFormBtn', loadForm);
    moduleManager.registerSidebarButton('saveFormBtn', saveForm);
    moduleManager.registerSidebarButton('settingsBtn', openSettings);
    moduleManager.registerSidebarButton('helpBtn', openHelp);
    moduleManager.registerSidebarButton('previewFormBtn', previewForm);
    moduleManager.registerSidebarButton('deleteFormBtn', deleteForm);

    moduleManager.initializeSidebarButtons();
}

function createNewForm() {
    // Implement create new form functionality
    console.log('Create new form');
}

function loadForm() {
    FormModule.loadForm(updateFormFields);
}

function saveForm() {
    FormModule.saveForm(formFields);
}

function openSettings() {
    // Implement settings functionality
    console.log('Open settings');
}

function openHelp() {
    // Implement help functionality
    console.log('Open help');
}

function previewForm() {
    UIModule.previewForm(formFields);
}

function deleteForm() {
    FormModule.deleteForm();
}

// Side menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Sidebar nav items functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        document.querySelectorAll('.builder-container > section').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector(`.${target}`).style.display = 'block';
    });
});
