import os
from flask import Flask
from flask import request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask import request
import re
import signal
import argparse

from xlsx_reader import read_xlsx
from xlsx_write import write_xlsx
number_regex = re.compile(r'^-?\d+(\.\d+)?$')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.json.sort_keys = False

# Argument parser
parser = argparse.ArgumentParser(description='Bookeeper Backend')
parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
parser.add_argument('--path', type=str, default=os.path.dirname(os.path.abspath(__file__)), help='Path to the server directory')
args = parser.parse_args()

app_path =  args.path
input_folder = os.path.join(app_path, 'input')
print('Input folder:', input_folder)

# Get file list 
def get_filelist():
    if not os.path.exists(input_folder):
        os.makedirs(input_folder)
    file = [f for f in os.listdir(input_folder) if f.endswith('.xlsx')]
    return file
# ----------------- Routes ----------------- #
@app.route("/homepage")
def homepage():
    return jsonify(filelist=get_filelist())
@app.route("/<filename>")
def main(filename):
    result = read_xlsx(filename, input_folder)
    if result is None:
        return jsonify(error="Failed to read the spreadsheet"), 400
    data, sheet_widths = result
    return jsonify(success=True, filename=str(filename), spreadsheet=dict(data), sheet_widths=dict(sheet_widths), filelist=get_filelist())

    
# ----------------- Create, Save, Delete, Rename File -----------------
@app.route('/create-new-file')
def create_new_file():
    try:
        new_filename = 'New_Spreadsheet' + '.xlsx'
        if not os.path.exists(input_folder):
            os.makedirs(input_folder)
        # Check if it is already created
        base_filename = 'New_Spreadsheet'
        new_filepath = os.path.join(input_folder, base_filename + '.xlsx')
        i = 1
        while os.path.exists(new_filepath):
            new_filename = f'{base_filename}_{i}.xlsx'
            new_filepath = os.path.join(input_folder, new_filename)
            i += 1
            
        data = {'General Journal': [[{header: '' for header in ['DATE', '', 'DESCRIPTION', 'P/R', 'DEBIT', 'CREDIT']}]],
                'General Ledger': [[{header: '' for header in ['DATE', '', 'DESCRIPTION', 'P/R', 'DEBIT', 'CREDIT', 'BALANCE', 'Title', 'Account No.']}]],
                'Chart of Accounts': [[{title: ''}, {'': ''}] for title in ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses']]}
        write_xlsx(new_filename, {'General Journal':[10, 10, 40, 10, 10, 10], 'General Ledger': [10, 10, 40, 10, 10, 10, 10, 10, 10]}, data, input_folder)

        return jsonify(success=True, filename=str(new_filename))
    except Exception as e:
        return jsonify(success=False, message=str(e))

@app.route('/save-data/<filename>', methods=['POST'])
def save_data(filename):
    try:
        get_data = request.json  # Get the JSON data from the request
        data = get_data[0]
        table_width = get_data[1]
        write_xlsx(filename, table_width, data, input_folder)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e))

@app.route('/rename-data/<new_filename>', methods=['POST'])
def rename_xlsx(new_filename):
    try:
        old_filename = request.json
        new_filename = secure_filename(new_filename)

        if new_filename == 'xlsx' or new_filename == '.xlsx':
            return jsonify(success=False, message='Invalid file name.')
        # Check if it is already created
        base_filename = new_filename
        new_filepath = os.path.join(input_folder, base_filename)
        i = 1
        while os.path.exists(new_filepath):
            new_filename = f'{base_filename}_{i}.xlsx'
            new_filepath = os.path.join(input_folder, new_filename)
            i += 1

        old_filepath = os.path.join(input_folder, old_filename)
        if os.path.exists(old_filepath):
            os.rename(old_filepath, new_filepath)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e))

@app.route('/delete-file/<filename>')
def delete_file(filename):
    try:
        filepath = os.path.join(input_folder, filename)
        print('Removing file:', filepath)
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e))

# ----------------- Download and Upload File -----------------
@app.route('/download/<filename>')
def download_xlsx(filename):
    file_path = os.path.join(app_path, 'input')
    print('Downloading file:', file_path)
    if os.path.exists(file_path):
        return send_from_directory(file_path, filename, as_attachment=True)

@app.route("/upload", methods=['POST'])
def upload():
    try:
        file = request.files['file']
        print(file)
        new_filename = ''
        if file and file.filename.endswith('.xlsx'):
            filename = secure_filename(file.filename)
            new_filename = f'{filename.split(".")[0]}'
            # Check if /input folder exists
            if not os.path.exists(input_folder):
                os.makedirs(input_folder)
            # Check if it is already created
            base_filename = secure_filename(new_filename)
            save_location = os.path.join(input_folder, base_filename + '.xlsx')
            i = 1
            while os.path.exists(save_location):
                new_filename = f'{base_filename}_{i}.xlsx'
                save_location = os.path.join(input_folder, new_filename)
                i += 1
            file.save(save_location)
            read_xlsx(new_filename, input_folder)
        print('New filename:', new_filename)
        if new_filename == '':
            return jsonify(success=False, message='Invalid file type. Please upload a .xlsx file.')
        return jsonify(success=True, filename=new_filename)
    except Exception as e:
        print('Error:', str(e))
        return jsonify(success=False, message=str(e))

@app.get('/shutdown')
def shutdown():
    os.kill(os.getpid(), signal.SIGINT)
    return jsonify(success=True, message='Server shutting down...')

if __name__ == '__main__':
    app.run(debug=True, port=args.port)

