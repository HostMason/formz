export class APIClient {
    constructor() {
        this.baseURL = '/api';
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Add specific API methods here
    async getFormData(formId) {
        return this.request(`/forms/${formId}`);
    }

    async saveFormData(formData) {
        return this.request('/forms', 'POST', formData);
    }

    async analyzeData(dataId) {
        return this.request(`/analyze/${dataId}`);
    }

    async generateReport(reportConfig) {
        return this.request('/reports', 'POST', reportConfig);
    }
}
