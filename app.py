from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_form', methods=['POST'])
def generate_form():
    form_data = request.json
    return render_template('form_template.html', form_data=form_data)

if __name__ == '__main__':
    app.run(debug=True)
