const landing = {
    init() {
        console.log('Landing page initialized');
        this.renderLandingContent();
    },

    renderLandingContent() {
        const landingContent = `
            <h1>Welcome to HostMason</h1>
            <p>HostMason is your all-in-one solution for form building, data analysis, and report generation.</p>
            <div class="feature-list">
                <div class="feature">
                    <h2>Form Builder</h2>
                    <p>Create custom forms with ease.</p>
                </div>
                <div class="feature">
                    <h2>Data Analyzer</h2>
                    <p>Gain insights from your data.</p>
                </div>
                <div class="feature">
                    <h2>Report Generator</h2>
                    <p>Generate professional reports in minutes.</p>
                </div>
            </div>
        `;
        document.querySelector('.main-content').innerHTML = landingContent;
    }
};

export default landing;
