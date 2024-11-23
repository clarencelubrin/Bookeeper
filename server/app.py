import os
import xlsxwriter
import pandas as pd
import openpyxl
from flask import Flask
from flask import request, send_from_directory, redirect, url_for, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import re
import json
number_regex = re.compile(r'^-?\d+(\.\d+)?$')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.json.sort_keys = False
# Constant variables
input_folder = 'server/input'

# ---------------- Read and Write .xlxs ----------------- #
def read_xlsx(filename):
    '''
        Parameters: filename (str)
        Returns: data (dict), sheet_widths (dict)
    '''
    filename = os.path.join(input_folder, filename)
    print(os.path.exists(filename))
    if not os.path.exists(filename):
        return
    try:
        df = pd.read_excel(filename, sheet_name="General Journal", header=1)
    except:
        return
    
    # Get the width of each column in the General Journal and General Ledger sheets
    wb = openpyxl.load_workbook(filename)
    sheet_widths = {}
    for sheetname in ['General Journal', 'General Ledger']:
        sheet =  wb[sheetname]
        widths = []
        # Get the width of each column
        for column_cells in sheet.columns:
            i = 0
            while True:
                try:
                    column_letter = column_cells[i].column_letter  # Column letter (A, B, C, etc.)
                    break
                except:
                    i += 1
            column_dimension = sheet.column_dimensions[column_letter]
            widths.append(column_dimension.width)
        sheet_widths[sheetname] = widths
    wb.close()

    # Remove default headers from data
    data = {'General Journal': [],
        'General Ledger': []}

    if df.empty:
        df = pd.DataFrame([{header: '' for header in df.columns}])
    df = df.fillna('')
    df.columns = [col.strip() if col != 'Unnamed: 1' and isinstance(col,str) else '' for col in df.columns]
    for col in df.select_dtypes(include=['float', 'int']).columns:
        df[col] = df[col].astype(str)
    data["General Journal"].append(df.to_dict(orient='records'))
    
    # Read the General Ledger sheet
    try:
        df = pd.read_excel(filename, sheet_name="General Ledger")
    except:
        return
     
    df = df.fillna('')
    def get_sheet_tables(df):
        df_tables = []
        index_row = 0
        for index, row in df.iterrows():
            if row.isnull().all() or (row == '').all():
                df_split = df.iloc[:index_row]
                df_tables.append(df_split)
                df = df.iloc[index_row+1:].reset_index(drop=True)
                index_row = 0
            else:
                index_row += 1
        else:
            df_tables.append(df)
        return df_tables
    df_tables = get_sheet_tables(df)

    for index, table in enumerate(df_tables):
        if not table.empty:
            # Get Title and Account No.
            top_row = table.iloc[0]
            count = 0
            title = ''
            account_no = ''
            for col in top_row:
                if col != '':                    
                    count += 1
                    if count == 1 and (col != 'Account No.' and col != 'Account Number'):
                        title = col
                    elif count == 3:
                        account_no = col
           
            table = table.iloc[1:] # Skip the top row (Title and Account No.)
            table = table.fillna('')
            
            table.columns = [col.strip() if col != 'Unnamed: 1' and isinstance(col,str) else '' for col in table.iloc[0]]
            table = table.iloc[1:] # Skip the header row 

            table['Title'] = title
            table['Account No.'] = account_no
            for col in table.select_dtypes(include=['float', 'int']).columns:
                table[col] = table[col].astype(str)
            
            # Ensure DataFrame columns are unique before converting to dictionary
            if table.columns.duplicated().any():
                table.columns = [f"{col}_{i}" if table.columns.duplicated()[i] else col for i, col in enumerate(table.columns)]
            data["General Ledger"].append(table.to_dict(orient='records'))
    if data["General Ledger"] == [[]]:
        # If General Ledger is empty and its the only table, add a default row
        data["General Ledger"][0] = [{header: '' for header in ['DATE', '', 'ITEMS', 'P/R', 'DEBIT', 'CREDIT', 'BALANCE', 'Title', 'Account No.']}].copy()
    # Remove empty arrays in data["General Ledger"]
    data["General Ledger"] = [table for table in data["General Ledger"] if table]
    
    # Read the Chart of Accounts sheet
    try:
        df = pd.read_excel(filename, sheet_name="Chart of Accounts")
    except:
        return
    
    df = df.fillna('')
    df_tables = get_sheet_tables(df)

    data["Chart of Accounts"] = []
    for index, table in enumerate(df_tables):
        table_contents = []
        if not table.empty:
            table.columns = range(len(table.columns))
            for index, row in table.iterrows():
                # try:
                if row[0] != '':
                    account_no = str(int(row[0]))
                else:
                    account_no = ''
                name = str(row[1])
                # except ValueError:
                #     account_no = row[1]
                # account_no (key): name (value)
                table_contents.append({name: account_no})
            if len(table_contents) <= 1:
                # If Chart of Accounts has no row content, add a default row
                table_contents.append({'': ''})
            data["Chart of Accounts"].append(table_contents)
    return data, sheet_widths

def write_xlsx(filename, tables_widths, data):
    '''
        Parameters: filename (str), tables_widths (list), data (dict)
    '''
    workbook = xlsxwriter.Workbook(filename)
    worksheet_journal = workbook.add_worksheet("General Journal")
    worksheet_ledger = workbook.add_worksheet("General Ledger")
    worksheet_chart_of_accounts = workbook.add_worksheet("Chart of Accounts")
    # Remove contents of the file if it already exists
    if os.path.exists(filename):
        os.remove(filename)

    # Normalize the widths
    multiplier = 0.8
    for i, table_width in tables_widths.items():
        table_width = [int(width) if width != None else 0 for width in table_width]
        width_sum = sum(table_width)
        for j, width in enumerate(table_width):
            tables_widths[i][j] = (width / width_sum) * 100 * multiplier

    # Border Styles
    header_cell = {'border': 1, 'bold': True}
    edge_cell = {'left': 1, 'right': 1}
    center_cell = {'left': 1}
    bottom_cell = {'left': 1, 'bottom': 1}
    
    # General Journal
    # Set column widths
    tables_widths_journal = tables_widths['General Journal']
    for i, width in enumerate(tables_widths_journal):
        worksheet_journal.set_column(i, i, width)
    # Title
    worksheet_journal.merge_range(0, 0, 0, len(data['General Journal'][0][0].keys()) - 1, "General Journal")
    worksheet_journal.write(0, 0, "General Journal", workbook.add_format({'bold': True, 'align': 'center'}))
    # Header Row
    for i, header in enumerate(data['General Journal'][0][0].keys()):
        worksheet_journal.write(1, i, header, workbook.add_format(header_cell))
    # Write data rows
    for table in data['General Journal']:
        for i, row in enumerate(table):
            for j, (key, value) in enumerate(row.items()):
                other_values = [str(v).strip() for k, v in row.items() if k != 'DESCRIPTION']
                style = {}
                value = str(value)
                value_write = value
                
                if j == len(row) - 1:                    
                    style = edge_cell
                else:
                    style = {**center_cell} 
                    value_write = value.replace('\t', '     ')
                    if all(v == '' for v in other_values):
                        style['italic'] = True
                if i == len(table) - 1:                        
                    style = {**style, **bottom_cell}
                if number_regex.match(value_write.replace(',', '')):
                    value_write = float(value_write.replace(',', ''))
                    style = {**style, **{'num_format': '#,##0'}}
                worksheet_journal.write(i + 2, j, value_write, workbook.add_format(style))

    # General Ledger
    # Set column widths
    tables_widths_ledger = tables_widths['General Ledger']
    for i, width in enumerate(tables_widths_ledger):
        worksheet_ledger.set_column(i, i, width)
    # Title
    worksheet_ledger.merge_range(0, 0, 0, len(data['General Ledger'][0][0].keys()) - 3, "General Ledger")
    worksheet_ledger.write(0, 0, "General Ledger", workbook.add_format({'bold': True, 'align': 'center'}))
        
    row_tracker = 1
    for table_index, table in enumerate(data['General Ledger']):
        # Write title and account no.
        worksheet_ledger.write(row_tracker, 2, table[0]['Title'], workbook.add_format({'bold': True, 'align': 'center'}))
        worksheet_ledger.write(row_tracker, 4, 'Account No.', workbook.add_format({'bold': True}))
        worksheet_ledger.write(row_tracker, 5, table[0]['Account No.'], workbook.add_format({'bold': True}))

        # Write header row
        for i, header in enumerate(table[0].keys()):
            if header == 'Title' or header == 'Account No.':
                continue
            worksheet_ledger.write(row_tracker + 1, i, header, workbook.add_format(header_cell))
        row_tracker += 2
        # Write data rows
        for i, row in enumerate(table):
            for j, (key, value) in enumerate(row.items()):
                if key == 'Title' or key == 'Account No.':
                    continue
                style = {}
                value = str(value)
                value_write = value
                if j == len(row) - 3:                  
                    style = edge_cell
                else:
                    style = {**center_cell}    
                if i == len(table) - 1:                        
                    style = {**style, **bottom_cell}
                if number_regex.match(value_write.replace(',', '')):
                    value_write = float(value_write.replace(',', ''))
                    style = {**style, **{'num_format': '#,##0'}}
                worksheet_ledger.write(row_tracker, j, value_write, workbook.add_format(style))
            row_tracker += 1
        row_tracker += 1
    
    # Chart of Accounts
    # Title
    worksheet_chart_of_accounts.merge_range(0, 0, 0, 1, "Chart of Accounts")
    worksheet_chart_of_accounts.write(0, 0, "Chart of Accounts", workbook.add_format({'bold': True, 'align': 'center'}))

    row_tracker = 1
    for table in data['Chart of Accounts']:
        '''
            Keys: Account Title
            Values: Account No.
        '''
        for i, row in enumerate(table):
            for j, (key, value) in enumerate(row.items()):
                style = {}
                if i == 0:
                    style = {**header_cell, **center_cell}
                else:
                    style = {'border': 1}
                if number_regex.match(value):
                    value = int(float(value))
                    style = {**style, **{'num_format': '###0'}}
                worksheet_chart_of_accounts.write(row_tracker, 1, key, workbook.add_format(style))
                worksheet_chart_of_accounts.write(row_tracker, 0, value, workbook.add_format(style))
            row_tracker += 1
        row_tracker += 1

    workbook.close()
    if not os.path.exists(input_folder):
        os.makedirs(input_folder)
    if os.path.exists(filename):
        os.replace(filename, os.path.join(input_folder, filename))

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
    # try:
        result = read_xlsx(filename)
        if result is None:
            return jsonify(error="Failed to read the spreadsheet"), 400
        data, sheet_widths = result
        return jsonify(success=True, filename=str(filename), spreadsheet=dict(data), sheet_widths=dict(sheet_widths), filelist=get_filelist())
    # except Exception as e:
    #     return jsonify(error=str(e)), 500
    
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
        write_xlsx(new_filename, {'General Journal':[10, 10, 40, 10, 10, 10], 'General Ledger': [10, 10, 40, 10, 10, 10, 10, 10, 10]}, data)

        return jsonify(success=True, filename=str(new_filename))
    except Exception as e:
        return jsonify(success=False, message=str(e))

@app.route('/save-data/<filename>', methods=['POST'])
def save_data(filename):
    try:
        get_data = request.json  # Get the JSON data from the request
        data = get_data[0]
        table_width = get_data[1]
        write_xlsx(filename, table_width, data)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e))

@app.route('/rename-data/<new_filename>', methods=['POST'])
def rename_xlsx(new_filename):
    try:
        old_filename = request.json
        new_filename = secure_filename(new_filename)
        if new_filename == 'xlsx' or new_filename == '.xlxs':
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

@app.route('/delete-file/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        filepath = os.path.join(input_folder, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e))

# ----------------- Download and Upload File -----------------
@app.route('/download/<filename>')
def download_xlsx(filename):
    try:
        file_path = os.path.join(os.path.dirname(__file__), 'input', filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route("/upload", methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
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
            read_xlsx(new_filename)
        if new_filename == '':
            return jsonify(success=False, message='Invalid file type. Please upload a .xlsx file.')
        return jsonify(success=True, filename=new_filename)

# print(json.dumps(read_xlsx('Showcase.xlsx'), indent=1))

if __name__ == '__main__':
    app.run(debug=True, port=5000)

