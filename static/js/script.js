import { UISystem } from './uiSystem.js';
import { FormBuilder } from './formBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const formBuilder = new FormBuilder();
    const uiSystem = new UISystem();
    uiSystem.formBuilder = formBuilder;

    // Close button for preview modal
    document.querySelector('#preview-modal .close').addEventListener('click', () => {
        document.getElementById('preview-modal').style.display = 'none';
    });
});
