let selectedField = null;
let formFields = [];

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

// Remove the selectField function as it's no longer needed

function updateFieldStyle(property, value) {
    if (selectedField) {
        selectedField.style[property] = value;
        
        // Update the corresponding field in the form view
        const formView = document.getElementById('form-view');
        const formFields = formView.querySelectorAll('.form-field');
        const index = Array.from(formFields).indexOf(selectedField);
        
        if (index !== -1) {
            const formViewField = formFields[index];
            const elementToStyle = formViewField.querySelector('input, textarea, select, button') || formViewField;
            elementToStyle.style[property] = value;
        }
    }
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const [r, g, b] = rgb.match(/\d+/g);
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
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

export { 
    createInputField, 
    createOptionField, 
    createSelectField, 
    selectField, 
    updateFieldLabel, 
    updateFieldPlaceholder, 
    updateFieldRequired, 
    updateFieldValue, 
    updateSelectOptions, 
    addSelectOption 
};
