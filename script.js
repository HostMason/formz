let selectedField = null;
let formFields = [];

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    let fieldElement;

    switch (data) {
        case 'text-input':
            fieldElement = createInputField('text', 'Enter text');
            break;
        case 'number-input':
            fieldElement = createInputField('number', 'Enter number');
            break;
        case 'email-input':
            fieldElement = createInputField('email', 'Enter email');
            break;
        case 'textarea':
            fieldElement = document.createElement('textarea');
            fieldElement.placeholder = 'Enter text';
            break;
        case 'button':
            fieldElement = document.createElement('button');
            fieldElement.innerText = 'Click Me';
            break;
        case 'radio-button':
            fieldElement = createOptionField('radio');
            break;
        case 'checkbox':
            fieldElement = createOptionField('checkbox');
            break;
        case 'select-dropdown':
            fieldElement = createSelectField();
            break;
    }

    fieldElement.className = 'form-field';
    fieldElement.onclick = function() {
        selectField(fieldElement);
    };
    event.target.appendChild(fieldElement);
    formFields.push(fieldElement);
}

function createInputField(type, placeholder) {
    const fieldElement = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} Input:`;
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    fieldElement.appendChild(label);
    fieldElement.appendChild(input);
    return fieldElement;
}

function createOptionField(type) {
    const fieldElement = document.createElement('div');
    const input = document.createElement('input');
    input.type = type;
    input.name = `${type}Group`;
    const label = document.createElement('input');
    label.type = 'text';
    label.placeholder = `${type.charAt(0).toUpperCase() + type.slice(1)} Option Label`;
    fieldElement.appendChild(input);
    fieldElement.appendChild(label);
    return fieldElement;
}

function createSelectField() {
    const fieldElement = document.createElement('div');
    const select = document.createElement('select');
    fieldElement.appendChild(select);
    return fieldElement;
}

function selectField(field) {
    selectedField = field;
    const fieldDetails = document.getElementById('field-details');
    fieldDetails.innerHTML = '';

    if (field.querySelector('input')) {
        const input = field.querySelector('input');
        fieldDetails.innerHTML = `
            <label>Label:</label> <input type="text" value="${field.querySelector('label')?.innerText || ''}" onchange="updateFieldLabel(this.value)">
            <label>Placeholder:</label> <input type="text" value="${input.placeholder}" onchange="updateFieldPlaceholder(this.value)">
            <label>Required:</label> <input type="checkbox" ${input.required ? 'checked' : ''} onchange="updateFieldRequired(this.checked)">
        `;
    } else if (field.querySelector('textarea')) {
        const textarea = field.querySelector('textarea');
        fieldDetails.innerHTML = `
            <label>Label:</label> <input type="text" value="${field.querySelector('label')?.innerText || ''}" onchange="updateFieldLabel(this.value)">
            <label>Placeholder:</label> <input type="text" value="${textarea.placeholder}" onchange="updateFieldPlaceholder(this.value)">
            <label>Required:</label> <input type="checkbox" ${textarea.required ? 'checked' : ''} onchange="updateFieldRequired(this.checked)">
        `;
    } else if (field.tagName === 'BUTTON') {
        fieldDetails.innerHTML = `
            <label>Button Text:</label> <input type="text" value="${field.innerText}" onchange="updateFieldValue(this.value, true)">
        `;
    } else if (field.querySelector('select')) {
        const select = field.querySelector('select');
        fieldDetails.innerHTML = `
            <label>Label:</label> <input type="text" value="${field.querySelector('label')?.innerText || ''}" onchange="updateFieldLabel(this.value)">
            <label>Options:</label> <textarea onchange="updateSelectOptions(this.value)">${Array.from(select.options).map(option => option.text).join('\n')}</textarea>
            <label>Required:</label> <input type="checkbox" ${select.required ? 'checked' : ''} onchange="updateFieldRequired(this.checked)">
            <label>Add Option:</label> <input type="text" id="newOption" placeholder="New option">
            <button onclick="addSelectOption()">Add Option</button>
        `;
    }
}

function addSelectOption() {
    if (selectedField) {
        const select = selectedField.querySelector('select');
        const newOptionInput = document.getElementById('newOption');
        const newOptionValue = newOptionInput.value.trim();
        if (newOptionValue) {
            const option = document.createElement('option');
            option.value = newOptionValue;
            option.text = newOptionValue;
            select.appendChild(option);
            newOptionInput.value = '';
            // Update the options textarea
            const optionsTextarea = document.querySelector('textarea');
            optionsTextarea.value = Array.from(select.options).map(option => option.text).join('\n');
        }
    }
}

function updateFieldLabel(value) {
    if (selectedField) {
        let label = selectedField.querySelector('label');
        if (!label) {
            label = document.createElement('label');
            selectedField.insertBefore(label, selectedField.firstChild);
        }
        label.innerText = value;
    }
}

function updateFieldPlaceholder(value) {
    if (selectedField) {
        const input = selectedField.querySelector('input') || selectedField.querySelector('textarea');
        if (input) {
            input.placeholder = value;
        }
    }
}

function updateFieldRequired(value) {
    if (selectedField) {
        const input = selectedField.querySelector('input') || selectedField.querySelector('textarea') || selectedField.querySelector('select');
        if (input) {
            input.required = value;
        }
    }
}

function updateFieldValue(value, isButton = false) {
    if (selectedField) {
        if (isButton) {
            selectedField.innerText = value;
        } else {
            selectedField.value = value;
        }
    }
}

function updateSelectOptions(value) {
    if (selectedField) {
        const select = selectedField.querySelector('select');
        if (select) {
            select.innerHTML = '';
            value.split('\n').forEach(optionText => {
                if (optionText.trim()) {
                    const option = document.createElement('option');
                    option.text = optionText.trim();
                    option.value = optionText.trim();
                    select.appendChild(option);
                }
            });
        }
    }
}

function previewForm() {
    const modal = document.getElementById('preview-modal');
    const previewForm = document.getElementById('preview-form');
    previewForm.innerHTML = '';
    
    formFields.forEach(field => {
        const clonedField = field.cloneNode(true);
        clonedField.onclick = null;
        previewForm.appendChild(clonedField);
    });

    modal.style.display = 'block';
}

function submitPreviewForm() {
    const formData = new FormData(document.getElementById('preview-form'));
    console.log('Form submitted:', Object.fromEntries(formData));
    alert('Form submitted! Check console for details.');
}

function saveForm() {
    const formHTML = document.getElementById('form-view').innerHTML;
    localStorage.setItem('savedForm', formHTML);
    alert('Form saved successfully!');
}

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('preview-modal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('preview-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Load saved form on page load
window.onload = function() {
    const savedForm = localStorage.getItem('savedForm');
    if (savedForm) {
        document.getElementById('form-view').innerHTML = savedForm;
        // Re-attach event listeners to loaded fields
        document.querySelectorAll('#form-view .form-field').forEach(field => {
            field.onclick = function() {
                selectField(field);
            };
            formFields.push(field);
        });
    }
}
