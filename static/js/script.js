document.addEventListener('DOMContentLoaded', () => {
    initializeFormBuilder();
    initializeEventListeners();
});

function initializeFormBuilder() {
    const formFields = document.getElementById('form-fields');
    const fieldTypes = document.querySelectorAll('.field-type');

    fieldTypes.forEach(fieldType => {
        fieldType.addEventListener('dragstart', dragStart);
        fieldType.addEventListener('dragend', dragEnd);
    });

    formFields.addEventListener('dragover', dragOver);
    formFields.addEventListener('drop', drop);
}

function initializeEventListeners() {
    document.getElementById('save-form').addEventListener('click', saveForm);
    document.getElementById('preview-form').addEventListener('click', previewForm);
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavItemClick);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-type'));
    e.target.style.opacity = '0.5';
}

function dragEnd(e) {
    e.target.style.opacity = '1';
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('text');
    const newField = createField(fieldType);
    e.target.appendChild(newField);
}

function createField(type) {
    const field = document.createElement('div');
    field.className = 'form-field';
    field.innerHTML = `<label>${type.charAt(0).toUpperCase() + type.slice(1)}:</label>`;
    
    let input;
    switch(type) {
        case 'text':
        case 'number':
        case 'email':
            input = document.createElement('input');
            input.type = type;
            break;
        case 'textarea':
            input = document.createElement('textarea');
            break;
        case 'checkbox':
        case 'radio':
            input = document.createElement('input');
            input.type = type;
            break;
        case 'select':
            input = document.createElement('select');
            input.innerHTML = '<option>Option 1</option><option>Option 2</option>';
            break;
    }
    
    field.appendChild(input);
    return field;
}

function saveForm() {
    const formFields = document.getElementById('form-fields');
    const formData = Array.from(formFields.children).map(field => {
        return {
            type: field.querySelector('input, textarea, select').tagName.toLowerCase(),
            label: field.querySelector('label').textContent
        };
    });
    console.log('Form saved:', formData);
    // Here you would typically send this data to a server
}

function previewForm() {
    const formFields = document.getElementById('form-fields');
    const previewWindow = window.open('', 'Form Preview', 'width=600,height=400');
    previewWindow.document.write('<h1>Form Preview</h1>');
    previewWindow.document.write('<form>');
    formFields.childNodes.forEach(field => {
        previewWindow.document.write(field.outerHTML);
    });
    previewWindow.document.write('<input type="submit" value="Submit">');
    previewWindow.document.write('</form>');
}

function handleNavItemClick(e) {
    const action = e.currentTarget.id;
    switch (action) {
        case 'formBuilderBtn':
            showPage('formBuilder');
            break;
        case 'helpBtn':
            showPage('help');
            break;
        default:
            showPage('landing');
            break;
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(`${pageId}-page`).style.display = 'block';
}
