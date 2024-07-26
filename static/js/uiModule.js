function showMenuPanel(panelId) {
    document.querySelectorAll('.menu-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(panelId).style.display = 'block';
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

function closeModal() {
    document.getElementById('preview-modal').style.display = 'none';
}

export { showMenuPanel, previewForm, submitPreviewForm, closeModal };
