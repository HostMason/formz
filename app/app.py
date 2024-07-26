from flask import Flask, render_template, request, url_for, jsonify
import os
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__, template_folder='../static/templates', static_folder='../static')

# Set up logging
if not app.debug:
    file_handler = RotatingFileHandler('app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('BlueColar Form Builder startup')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_form', methods=['POST'])
def generate_form():
    try:
        form_data = request.json
        return render_template('form_template.html', form_data=form_data)
    except Exception as e:
        app.logger.error(f'Error generating form: {str(e)}')
        return jsonify({'error': 'An error occurred while generating the form'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
