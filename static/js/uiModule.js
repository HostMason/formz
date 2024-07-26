function showMenuPanel(panelId) {
    document.querySelectorAll('.menu-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(panelId).style.display = 'block';
}

let currentPage = 0;
const fieldsPerPage = 5;

function previewForm() {
    currentPage = 0;
    updateFormView();
    document.getElementById('form-preview').style.display = 'block';
    document.getElementById('fields').style.display = 'none';
    document.getElementById('field-view').style.display = 'none';
}

function updateFormView() {
    const previewContent = document.getElementById('preview-content');
    previewContent.innerHTML = '';
    
    const startIndex = currentPage * fieldsPerPage;
    const endIndex = Math.min(startIndex + fieldsPerPage, formFields.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const clonedField = formFields[i].cloneNode(true);
        clonedField.onclick = null;
        previewContent.appendChild(clonedField);
    }
    
    updateNavigation();
    updateProgressBar();
}

function navigateForm(direction) {
    currentPage += direction;
    updateFormView();
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = currentPage > 0 ? 'inline-block' : 'none';
    
    if (currentPage >= Math.ceil(formFields.length / fieldsPerPage) - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function updateProgressBar() {
    const progress = document.querySelector('.progress');
    const percentage = ((currentPage + 1) / Math.ceil(formFields.length / fieldsPerPage)) * 100;
    progress.style.width = `${percentage}%`;
}

function submitForm() {
    const formData = new FormData();
    formFields.forEach((field, index) => {
        const input = field.querySelector('input, textarea, select');
        if (input) {
            formData.append(`field_${index}`, input.value);
        }
    });
    console.log('Form submitted:', Object.fromEntries(formData));
    alert('Form submitted! Check console for details.');
}

export { showMenuPanel, previewForm, submitPreviewForm, closeModal };
