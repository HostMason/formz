import { FormBuilder } from '../formBuilder.js';

const formBuilder = {
    init() {
        this.formBuilder = new FormBuilder();
        this.attachEventListeners();
    },

    attachEventListeners() {
        document.getElementById('previewFormBtn').addEventListener('click', () => this.formBuilder.previewForm());
        document.getElementById('saveFormBtn').addEventListener('click', () => this.formBuilder.saveForm());
        document.getElementById('loadFormBtn').addEventListener('click', () => this.formBuilder.loadForm());
        document.getElementById('deleteFormBtn').addEventListener('click', () => this.formBuilder.deleteForm());
    }
};

window.formBuilder = formBuilder;
