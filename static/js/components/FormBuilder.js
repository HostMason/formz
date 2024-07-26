import Component from './Component.js';

export default class FormBuilder extends Component {
    render() {
        return `
            <div id="formBuilder-page" class="page">
                <header class="main-header">
                    <h1><i class="fas fa-hammer"></i> Form Builder</h1>
                    <div class="form-actions">
                        <button id="previewFormBtn" class="action-button"><i class="fas fa-eye"></i> Preview</button>
                        <button id="saveFormBtn" class="action-button"><i class="fas fa-save"></i> Save</button>
                        <button id="loadFormBtn" class="action-button"><i class="fas fa-folder-open"></i> Load</button>
                        <button id="deleteFormBtn" class="action-button"><i class="fas fa-trash-alt"></i> Delete</button>
                        <select id="form-list"></select>
                    </div>
                </header>
                <div class="builder-container">
                    <section class="field-types">
                        <h2><i class="fas fa-toolbox"></i> Field Types</h2>
                        <div class="fields-grid">
                            <button class="field-type-button" data-field-type="text-input"><i class="fas fa-font"></i> Text</button>
                            <button class="field-type-button" data-field-type="number-input"><i class="fas fa-hashtag"></i> Number</button>
                            <button class="field-type-button" data-field-type="email-input"><i class="fas fa-envelope"></i> Email</button>
                            <button class="field-type-button" data-field-type="textarea"><i class="fas fa-align-left"></i> Textarea</button>
                            <button class="field-type-button" data-field-type="button"><i class="fas fa-square"></i> Button</button>
                            <button class="field-type-button" data-field-type="radio-button"><i class="fas fa-dot-circle"></i> Radio</button>
                            <button class="field-type-button" data-field-type="checkbox"><i class="fas fa-check-square"></i> Checkbox</button>
                            <button class="field-type-button" data-field-type="select-dropdown"><i class="fas fa-caret-square-down"></i> Select</button>
                        </div>
                    </section>
                    <section class="form-preview">
                        <h2><i class="fas fa-clipboard-list"></i> Form Preview</h2>
                        <div id="preview-content" class="form-field-container">
                            <p class="drag-placeholder">Drag and drop fields here</p>
                        </div>
                    </section>
                    <section class="field-properties">
                        <h2><i class="fas fa-sliders-h"></i> Field Properties</h2>
                        <div class="properties-form">
                            <label for="fieldLabel">Label:</label>
                            <input type="text" id="fieldLabel">
                            <label for="fieldPlaceholder">Placeholder:</label>
                            <input type="text" id="fieldPlaceholder">
                            <label for="fieldRequired">Required:</label>
                            <input type="checkbox" id="fieldRequired">
                            <div id="fieldOptions" style="display: none;">
                                <label for="fieldOptionsText">Options:</label>
                                <textarea id="fieldOptionsText"></textarea>
                                <input type="text" id="newOption" placeholder="New option">
                                <button id="addOptionBtn"><i class="fas fa-plus"></i> Add Option</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Initialize form builder functionality
        // This is where you'd add event listeners, drag-and-drop functionality, etc.
    }
}
