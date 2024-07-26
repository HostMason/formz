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
            fieldElement = document.createElement('input');
            fieldElement.type = 'radio';
            const radioLabel = document.createElement('label');
            radioLabel.innerText = 'Radio Option';
            fieldElement.appendChild(radioLabel);
            break;
        case 'checkbox':
            fieldElement = document.createElement('input');
            fieldElement.type = 'checkbox';
            const checkboxLabel = document.createElement('label');
            checkboxLabel.innerText = 'Checkbox Option';
            fieldElement.appendChild(checkboxLabel);
            break;
        case 'select-dropdown':
            fieldElement = document.createElement('select');
            const option1 = document.createElement('option');
            option1.value = 'option1';
            option1.text = 'Option 1';
            const option2 = document.createElement('option');
            option2.value = 'option2';
            option2.text = 'Option 2';
            fieldElement.appendChild(option1);
            fieldElement.appendChild(option2);
            break;
    }

    fieldElement.setAttribute("contenteditable", "true");
    event.target.appendChild(fieldElement);
}
