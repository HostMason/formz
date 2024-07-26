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

    // Add style modification section
    fieldDetails.innerHTML += `
        <h3>Style Modifications</h3>
        <label>Font Size:</label> <input type="number" value="${getComputedStyle(field).fontSize.replace('px', '')}" onchange="updateFieldStyle('fontSize', this.value + 'px')">
        <label>Font Color:</label> <input type="color" value="${rgbToHex(getComputedStyle(field).color)}" onchange="updateFieldStyle('color', this.value)">
        <label>Background Color:</label> <input type="color" value="${rgbToHex(getComputedStyle(field).backgroundColor)}" onchange="updateFieldStyle('backgroundColor', this.value)">
        <label>Border Color:</label> <input type="color" value="${rgbToHex(getComputedStyle(field).borderColor)}" onchange="updateFieldStyle('borderColor', this.value)">
        <label>Border Width:</label> <input type="number" value="${getComputedStyle(field).borderWidth.replace('px', '')}" onchange="updateFieldStyle('borderWidth', this.value + 'px')">
        <label>Border Radius:</label> <input type="number" value="${getComputedStyle(field).borderRadius.replace('px', '')}" onchange="updateFieldStyle('borderRadius', this.value + 'px')">
        <label>Padding:</label> <input type="number" value="${getComputedStyle(field).padding.replace('px', '')}" onchange="updateFieldStyle('padding', this.value + 'px')">
    `;
}

function updateFieldStyle(property, value) {
    if (selectedField) {
        selectedField.style[property] = value;
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
