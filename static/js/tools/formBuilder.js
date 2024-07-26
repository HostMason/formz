import { FormBuilder } from '../formBuilder.js';

const formBuilder = {
    init() {
        this.formBuilder = new FormBuilder();
        this.formBuilder.initialize();
        this.attachEventListeners();
    },

    attachEventListeners() {
        document.getElementById('preview-form-btn')?.addEventListener('click', () => this.formBuilder.previewForm());
        document.getElementById('save-form-btn')?.addEventListener('click', () => this.formBuilder.saveForm());
        document.getElementById('form-list')?.addEventListener('change', (e) => this.formBuilder.loadForm(e.target.value));
        document.getElementById('create-form-btn')?.addEventListener('click', () => this.formBuilder.createNewForm());
    }
};

export default formBuilder;
