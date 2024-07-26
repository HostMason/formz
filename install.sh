#!/bin/bash

# Update package list
echo "Updating package list..."
sudo apt update

# Install Python3 and pip if not already installed
echo "Installing Python3 and pip..."
sudo apt install -y python3 python3-pip

# Install Flask and other required packages
echo "Installing required Python packages..."
pip3 install Flask

# Install any other dependencies if needed
# For example, if you have additional packages, you can add them here
# pip3 install <package_name>

# Create necessary directories if they don't exist
echo "Creating necessary directories..."
mkdir -p static/js/tools
mkdir -p static/templates

echo "All dependencies installed and directories created successfully!"
