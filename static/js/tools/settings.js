const settings = {
    init() {
        console.log('Settings page initialized');
        this.renderSettingsContent();
    },

    renderSettingsContent() {
        const settingsContent = `
            <h1>Settings</h1>
            <form id="settings-form">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username">
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="theme">Theme:</label>
                    <select id="theme" name="theme">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <button type="submit">Save Settings</button>
            </form>
        `;
        document.querySelector('.main-content').innerHTML = settingsContent;
        this.attachEventListeners();
    },

    attachEventListeners() {
        document.getElementById('settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Settings saved');
            // Here you would typically save the settings to a backend or local storage
        });
    }
};

export default settings;
