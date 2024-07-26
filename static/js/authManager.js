export class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
    }

    async init() {
        this.token = localStorage.getItem('token');
        if (this.token) {
            await this.fetchUserData();
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUserData();
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async fetchUserData() {
        try {
            const response = await fetch('/api/user', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (response.ok) {
                this.user = await response.json();
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            this.logout();
        }
    }

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    isAuthenticated() {
        return !!this.token;
    }
}
