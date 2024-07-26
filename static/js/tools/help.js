const help = {
    init() {
        console.log('Help page initialized');
        this.renderHelpContent();
    },

    renderHelpContent() {
        const helpContent = `
            <h1>Help Center</h1>
            <p>Welcome to the Help Center. Here you can find information about how to use our application.</p>
            <ul>
                <li><a href="#getting-started">Getting Started</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
                <li><a href="#contact-support">Contact Support</a></li>
            </ul>
        `;
        document.querySelector('.main-content').innerHTML = helpContent;
    }
};

export default help;
