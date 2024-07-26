function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const inputElement = document.getElementById(data);
    event.target.appendChild(inputElement);
}

function nextStep(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(s => s.style.display = 'none');
    document.getElementById(`step-${step}`).style.display = 'block';
}

function submitForm() {
    alert("Form submitted!");
}
