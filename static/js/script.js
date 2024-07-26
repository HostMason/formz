import { UISystem } from './uiSystem.js';
import { FormBuilder } from './formBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const formBuilder = new FormBuilder();
    const uiSystem = new UISystem();
    uiSystem.formBuilder = formBuilder;

    // Close button for preview modal
    const closeButton = document.querySelector('#preview-modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.getElementById('preview-modal').style.display = 'none';
        });
    } else {
        console.error('Close button not found');
    }

    // Initialize the navigation
    uiSystem.renderNavigation();

    // Show the landing page by default
    uiSystem.showPage('landing');
});
