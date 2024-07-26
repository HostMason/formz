let forms = {};
let currentFormName = '';

function saveForm(formFields) {
    const formName = prompt("Enter a name for this form:");
    if (formName) {
        forms[formName] = {
            fields: formFields.map(field => ({
                type: field.querySelector('input, textarea, select, button')?.tagName.toLowerCase(),
                label: field.querySelector('label')?.innerText || '',
                placeholder: field.querySelector('input, textarea')?.placeholder || '',
                required: field.querySelector('input, textarea, select')?.required || false,
                options: field.querySelector('select') ? Array.from(field.querySelector('select').options).map(option => option.text) : []
            }))
        };
        localStorage.setItem('forms', JSON.stringify(forms));
        currentFormName = formName;
        updateFormList();
        alert('Form saved successfully!');
    }
}

function deleteForm(formName) {
    if (forms[formName]) {
        delete forms[formName];
        localStorage.setItem('forms', JSON.stringify(forms));
        updateFormList();
        alert('Form deleted successfully!');
    } else {
        alert('Form not found.');
    }
}

function loadForm() {
    const formName = document.getElementById('form-list').value;
    if (formName && forms[formName]) {
        document.getElementById('preview-content').innerHTML = forms[formName].html;
        formFields = Array.from(document.querySelectorAll('#preview-content .form-field'));
        formFields.forEach(field => {
            field.onclick = function() {
                selectField(field);
            };
        });
        currentFormName = formName;
        alert('Form loaded successfully!');
    }
}

function deleteForm() {
    const formName = document.getElementById('form-list').value;
    if (formName && forms[formName]) {
        delete forms[formName];
        localStorage.setItem('forms', JSON.stringify(forms));
        updateFormList();
        if (currentFormName === formName) {
            document.getElementById('preview-content').innerHTML = '<p>Your form preview will appear here</p>';
            formFields = [];
            currentFormName = '';
        }
        alert('Form deleted successfully!');
    }
}

function updateFormList() {
    const formList = document.getElementById('form-list');
    formList.innerHTML = '';
    Object.keys(forms).forEach(formName => {
        const option = document.createElement('option');
        option.value = formName;
        option.textContent = formName;
        formList.appendChild(option);
    });
}

function loadSavedForms() {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
        forms = JSON.parse(savedForms);
        updateFormList();
    }
}

function deleteForm(formName) {
    if (forms[formName]) {
        delete forms[formName];
        localStorage.setItem('forms', JSON.stringify(forms));
        updateFormList();
        return true;
    }
    return false;
}

export { saveForm, loadForm, deleteForm, updateFormList, loadSavedForms };
