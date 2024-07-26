const API_BASE_URL = '/api';

export async function saveForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/save_form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving form:', error);
        throw error;
    }
}

export async function loadForm(formName) {
    try {
        const response = await fetch(`${API_BASE_URL}/load_form/${formName}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading form:', error);
        throw error;
    }
}

export async function deleteForm(formName) {
    try {
        const response = await fetch(`${API_BASE_URL}/delete_form/${formName}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting form:', error);
        throw error;
    }
}

export async function getFormList() {
    try {
        const response = await fetch(`${API_BASE_URL}/form_list`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting form list:', error);
        throw error;
    }
}
