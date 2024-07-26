# Hostmason Internal Systems

This project is an internal system for Hostmason customers, providing various tools to manage and customize services.

## Features

- Form Builder
  - Drag and drop form creation
  - Custom field types
  - Form templates
  - Form preview
  - Save and load forms
  - Form settings management

- Data Analyzer
  - Data import
  - Various analysis options
  - Export results

- Report Generator
  - Create custom reports
  - Edit report templates
  - Schedule automated reports

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

## Maintenance Instructions

### Reloading the Service After Code Updates

1. **Pull the Latest Changes**
    ```bash
    git pull origin main
    ```

2. **Run the Reload Command**
    The reload command will restart the web application service to apply the latest changes.
    ```bash
    ./setup_webapp.sh reload
    ```

### Managing Forms

- **Save Form**: Use the "Save Form" button to save the current form.
- **Load Form**: Use the "Load Form" button to load a saved form from the dropdown list.
- **Delete Form**: Use the "Delete Form" button to delete a selected form from the dropdown list.

### Debugging

- **Check Service Status**
    ```bash
    sudo systemctl status webapp
    ```

- **View Service Logs**
    ```bash
    sudo journalctl -u webapp
    ```

### Firewall Configuration

- **Allow a Specific Port**
    ```bash
    sudo ufw allow <port_number>
    ```

- **Check UFW Status**
    ```bash
    sudo ufw status
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
│   │   └── themeManager.js
│   └── templates/
│       ├── index.html
│       ├── formBuilder.html
│       ├── dataAnalyzer.html
│       └── reportGenerator.html
├── setup_webapp.sh
└── install.sh
```

## Additional Notes

- Ensure that the `setup_webapp.sh` script has execute permissions. If not, you can set it using:
    ```bash
    chmod +x setup_webapp.sh
    ```

- The `install.sh` script is used to install dependencies and can be run separately if needed.

- For any issues or further assistance, please refer to the service logs or contact the support team.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
