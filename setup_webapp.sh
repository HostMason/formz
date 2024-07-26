#!/bin/bash

# Function to install necessary packages
install_packages() {
    echo "Updating package list..."
    sudo apt update
    echo "Installing Python3 and pip..."
    sudo apt install -y python3 python3-pip
    echo "Installing Flask..."
    pip3 install Flask
}

# Function to create a systemd service
create_service() {
    echo "Creating systemd service..."
    SERVICE_FILE="/etc/systemd/system/webapp.service"
    echo "[Unit]
Description=Flask Web Application

[Service]
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/python3 app/app.py
Restart=always

[Install]
WantedBy=multi-user.target" | sudo tee $SERVICE_FILE

    echo "Service created at $SERVICE_FILE"
}

# Function to configure firewall
configure_firewall() {
    echo "Configuring firewall..."
    sudo ufw allow $1
    echo "Firewall configured to allow traffic on port $1."
}

# Function to start and enable the service
start_service() {
    echo "Starting the web application service..."
    sudo systemctl start webapp
    sudo systemctl enable webapp
    echo "Web application service started and enabled to run on boot."
}

# Function to reload the service
reload_service() {
    echo "Reloading the web application service..."
    sudo systemctl daemon-reload
    sudo systemctl restart webapp
    echo "Web application service reloaded."
}

# Main script execution
if [ "$1" == "reload" ]; then
    reload_service
    exit 0
fi

echo "Welcome to the Web Application Setup Script!"
install_packages

read -p "Please enter the port number for the web application (default is 5000): " PORT
PORT=${PORT:-5000}

create_service
configure_firewall $PORT
start_service

echo "Setup complete! You can access the web application at http://localhost:$PORT"
echo "To reload the service after code updates, run: ./setup_webapp.sh reload"
