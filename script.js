let selectedField = null;

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
            fieldElement = document.createElement('input');
            fieldElement.type = 'text';
            fieldElement.placeholder = 'Enter text';
            break;
        case 'button':
            fieldElement = document.createElement('button');
            fieldElement.innerText = 'Click Me';
            break;
        case 'radio-button':
            fieldElement = document.createElement('div');
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'radioGroup';
            const radioLabel = document.createElement('input');
            radioLabel.type = 'text';
            radioLabel.placeholder = 'Radio Option Label';
            fieldElement.appendChild(radioInput);
            fieldElement.appendChild(radioLabel);
            break;
        case 'checkbox':
            fieldElement = document.createElement('div');
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            const checkboxLabel = document.createElement('input');
            checkboxLabel.type = 'text';
            checkboxLabel.placeholder = 'Checkbox Option Label';
            fieldElement.appendChild(checkboxInput);
            fieldElement.appendChild(checkboxLabel);
            break;
        case 'select-dropdown':
            fieldElement = document.createElement('select');
            const optionInput = document.createElement('input');
            optionInput.type = 'text';
            optionInput.placeholder = 'Add Option';
            const addButton = document.createElement('button');
            addButton.innerText = 'Add Option';
            addButton.onclick = function() {
                const optionValue = optionInput.value;
                if (optionValue) {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.text = optionValue;
                    fieldElement.appendChild(option);
                    optionInput.value = '';
                }
            };
            fieldElement.appendChild(optionInput);
            fieldElement.appendChild(addButton);
            break;
    }

    fieldElement.setAttribute("contenteditable", "true");
    fieldElement.onclick = function() {
        selectField(fieldElement);
    };
    event.target.appendChild(fieldElement);
}

function selectField(field) {
    selectedField = field;
    const fieldDetails = document.getElementById('field-details');
    fieldDetails.innerHTML = '';

    if (field.tagName === 'INPUT' && field.type === 'text') {
        fieldDetails.innerHTML = `
            <label>Label:</label> <input type="text" value="Text Input" onchange="updateFieldLabel(this.value)">
            <label>Placeholder:</label> <input type="text" value="${field.placeholder}" onchange="updateFieldPlaceholder(this.value)">
        `;
    } else if (field.tagName === 'BUTTON') {
        fieldDetails.innerHTML = `
            <label>Button Text:</label> <input type="text" value="${field.innerText}" onchange="updateFieldValue(this.value, true)">
        `;
    } else if (field.tagName === 'SELECT') {
        fieldDetails.innerHTML = `
            <label>Select Options:</label> <input type="text" placeholder="Add Option" onchange="updateSelectOptions(this.value)">
        `;
    } else if (field.firstChild && field.firstChild.type === 'radio') {
        fieldDetails.innerHTML = `
            <label>Radio Option Label:</label> <input type="text" value="${field.firstChild.nextSibling.placeholder}" onchange="updateFieldLabel(this.value, true)">
        `;
    } else if (field.firstChild && field.firstChild.type === 'checkbox') {
        fieldDetails.innerHTML = `
            <label>Checkbox Option Label:</label> <input type="text" value="${field.firstChild.nextSibling.placeholder}" onchange="updateFieldLabel(this.value, false, true)">
        `;
    }
}

function updateFieldLabel(value, isRadio = false, isCheckbox = false) {
    if (selectedField) {
        if (isRadio) {
            selectedField.firstChild.nextSibling.placeholder = value;
        } else if (isCheckbox) {
            selectedField.firstChild.nextSibling.placeholder = value;
        } else {
            selectedField.setAttribute('placeholder', value);
        }
    }
}

function updateFieldPlaceholder(value) {
    if (selectedField) {
        selectedField.placeholder = value;
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
    if (selectedField && value) {
        const option = document.createElement('option');
        option.value = value;
        option.text = value;
        selectedField.appendChild(option);
    }
}
