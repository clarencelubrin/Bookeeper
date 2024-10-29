import os
import xlsxwriter
import pandas as pd
import openpyxl
from flaskwebgui import FlaskUI
from flask import Flask
from flask import request, send_from_directory, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import re
number_regex = re.compile(r'^-?\d+(\.\d+)?$')

app = Flask(__name__)

# ----------------- Global Data -----------------
data = {'General Journal': [],
        'General Ledger': [],
        'Chart of Accounts': []}
sheet_widths = {'General Journal': [],
        'General Ledger': []}
file = []
# Global variables
current_filename = ''
input_folder = './input'

def get_filelist():
    global file
    if not os.path.exists(input_folder):
        os.makedirs(input_folder)
    file = [f for f in os.listdir(input_folder) if f.endswith('.xlsx')]
    return file

# ----------------- Read and Write XLSX -----------------
def read_xlsx(filename):
    '''
        Parameters: filename: str, it is a filepath to the xlsx file
    '''
    global data
    global sheet_widths

    filename = os.path.join(input_folder, filename)
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
        df[col] = pd.to_numeric(df[col], downcast='integer', errors='coerce').fillna(0).astype(int)
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

            for col in table.select_dtypes(include=['float', 'int']).columns:
                table[col] = pd.to_numeric(table[col], downcast='integer', errors='coerce').fillna(0).astype(int)
            table['Title'] = title
            table['Account No.'] = account_no
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
                try:
                    account_no = int(row[0])
                except ValueError:
                    account_no = row[0]
                table_contents.append({account_no: row[1]})
            if len(table_contents) == 1:
                # If Chart of Accounts has no row content, add a default row
                table_contents.append({'': ''})
            data["Chart of Accounts"].append(table_contents)
    print(data)

def write_xlsx(filename, tables_widths):
    '''
        Parameters: filename: str (name of the file to be saved, do not include the folder path)
    '''
    global data
    workbook = xlsxwriter.Workbook(filename)
    worksheet_journal = workbook.add_worksheet("General Journal")
    worksheet_ledger = workbook.add_worksheet("General Ledger")
    worksheet_chart_of_accounts = workbook.add_worksheet("Chart of Accounts")
    # Remove contents of the file if it already exists
    if os.path.exists(filename):
        os.remove(filename)

    # Normalize the widths
    multiplier = 0.8
    for i, table_width in enumerate(tables_widths):
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
    tables_widths_journal = tables_widths[0]
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
    tables_widths_ledger = tables_widths[1]
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
                    print(value)
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

# ----------------- Main Routes -----------------
@app.route("/", methods=['GET', 'POST'])
def main():
    global data
    read_xlsx('New_Spreadsheet.xlsx')
    return jsonify(data=data, file_list=get_filelist())

@app.route("/<filename>", methods=['GET', 'POST'])
def page_file(filename):
    global current_filename
    if filename != current_filename:
        read_xlsx(filename)
    if not filename.endswith('.xlsx'): # If the filename does not have the .xlsx extension
        filename = current_filename
    current_filename = filename # Set the (global) current filename
    filename_name = filename.replace('.xlsx', '')
    return jsonify(data=data, filename=filename_name, file_list=get_filelist(), sheet_widths=sheet_widths)

# ----------------- Create, Save, Delete, Rename File -----------------
@app.route('/create-new-file', methods=['POST'])
def create_new_file():
    global data, current_filename
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
    print(data, "Initial data")
    write_xlsx(new_filename, [[10, 10, 40, 10, 10, 10], [10, 10, 40, 10, 10, 10, 10, 10, 10]])
    read_xlsx(new_filename)
    current_filename = new_filename
    return jsonify(success=True, filename=new_filename)
@app.route('/save-data/<filename>', methods=['POST'])
def save_data(filename):
    try:
        global data
        get_data = request.json  # Get the JSON data from the request
        data = get_data[0]
        table_width = get_data[1]
        write_xlsx(filename, table_width)
        read_xlsx(filename)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, error=str(e))

@app.route('/delete-file/<filename>', methods=['POST'])
def delete_file(filename):
    global current_filename
    filepath = os.path.join(input_folder, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    current_filename = ''
    return jsonify(success=True)

@app.route('/rename-data/<new_filename>', methods=['POST'])
def rename_xlsx(new_filename):
    global current_filename
    new_filename = secure_filename(new_filename)
    # Check if it is already created
    base_filename = secure_filename(new_filename)
    new_filepath = os.path.join(input_folder, base_filename + '.xlsx')
    i = 1
    while os.path.exists(new_filepath):
        new_filename = f'{base_filename}_{i}.xlsx'
        new_filepath = os.path.join(input_folder, new_filename)
        i += 1

    old_filepath = os.path.join(input_folder, current_filename)
    if os.path.exists(old_filepath):
        os.rename(old_filepath, new_filepath)

    current_filename = new_filename
    return jsonify(success=True, filename=current_filename)

# ----------------- Download and Upload File -----------------
@app.route('/download/<filename>')
def download_xlsx(filename):
    global current_filename
    if os.path.exists(input_folder + filename):
        return send_from_directory(input_folder, filename, as_attachment=True)

@app.route("/upload", methods=['GET', 'POST'])
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
            return redirect(url_for('/'))
        return redirect(url_for('page_file', filename=new_filename))


if __name__ == '__main__':
    # app.run(debug=True)
    FlaskUI(app=app, server="flask", width=800, height=600).run()

