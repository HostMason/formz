# HostMason Internal Tools

This project is an internal system for HostMason customers, providing various tools to manage and customize services.

## Features

### Form Builder
- Drag and drop form creation
- Custom field types (text, number, email, textarea, checkbox, radio button, dropdown)
- Form preview functionality
- Save and load forms
- Delete existing forms
- Form settings management

### UI Improvements
- Responsive sidebar navigation
- Dark/Light theme toggle
- Improved layout and styling

## Setup Instructions

### Prerequisites
- Ensure you have Python 3 and pip installed on your system.
- Ensure you have `ufw` (Uncomplicated Firewall) installed and enabled.

### Step-by-Step Setup

1. **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Run the Setup Script**
    The setup script will install necessary packages, create a systemd service, configure the firewall, and start the web application.
    ```bash
    ./setup_webapp.sh
    ```

3. **Access the Web Application**
    Open your web browser and navigate to `http://localhost:5000` (or the port you specified during setup).

## Usage Instructions

1. **Navigation**: Use the sidebar to navigate between different tools and pages.
2. **Form Builder**: 
   - Drag field types from the left panel to the form preview area.
   - Click on a field in the preview to edit its properties in the right panel.
   - Use the top buttons to preview, save, load, or delete forms.
3. **Theme**: Toggle between light and dark themes using the theme toggle button.

## Maintenance Instructions

### Reloading the Service After Code Updates

1. **Pull the Latest Changes**
    ```bash
    git pull origin main
    ```

2. **Run the Reload Command**
    ```bash
    ./setup_webapp.sh reload
    ```

### Debugging

- **Check Service Status**
    ```bash
    sudo systemctl status webapp
    ```

- **View Service Logs**
    ```bash
    sudo journalctl -u webapp
    ```

## Directory Structure

```
<repository_directory>/
├── app/
│   ├── __init__.py
│   └── app.py
├── static/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── uiManager.js
│   │   ├── toolManager.js
│   │   ├── router.js
│   │   ├── themeManager.js
│   │   └── formBuilder.js
│   └── templates/
│       ├── index.html
│       ├── landing.html
│       ├── formBuilder.html
│       └── help.html
├── setup_webapp.sh
└── README.md
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For any issues or further assistance, please contact the support team at support@hostmason.com.
