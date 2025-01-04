import os
import xlsxwriter
import pandas as pd
import openpyxl
import re
import pprint as pp
number_regex = re.compile(r'^-?\d+(\.\d+)?$')

# ---------------- Read and Write .xlxs ----------------- #
def read_xlsx(filename, input_folder):
    '''
        Parameters: filename (str)
        Returns: data (dict), sheet_widths (dict)
    '''
    filename = os.path.join(input_folder, filename)
    if (not os.path.exists(filename)):
        return None, None
    data = {}

    data['General Journal'] = read_journal(filename, 'General Journal')
    data['General Ledger'] = read_ledger(filename, 'General Ledger')
    data['Chart of Accounts'] = read_chart_of_accounts(filename, 'Chart of Accounts')
    
    sheet_widths = {}
    sheet_widths['General Journal'] = get_sheet_widths(filename, 'General Journal')
    sheet_widths['General Ledger'] = get_sheet_widths(filename, 'General Ledger')
    
    return data, sheet_widths

def read_journal(sheet, sheetname):
    df = pd.read_excel(sheet, sheetname, header=1)
    df = df.fillna('') # Remove null values

    sheet_data = []
    # Get the tables in the sheet
    if not df.empty:
        df = df.fillna('')
        df.columns = [col.strip() if col != 'Unnamed: 1' and isinstance(col,str) else '' for col in df.columns]
        for col in df.select_dtypes(include=['float', 'int']).columns:
            df[col] = df[col].astype(str)
        sheet_data.append(df.to_dict(orient='records'))
    else:
        # If Journal has no row content, add a default row
        sheet_data.append([{header: '' for header in ['DATE', '', 'DESCRIPTION', 'P/R', 'DEBIT', 'CREDIT']}])
    return sheet_data

def read_ledger(sheet, sheetname):
    df = pd.read_excel(sheet, sheetname)
    df = df.fillna('') # Remove null values

    sheet_data = []
    # Get the tables in the sheet
    df_tables = get_sheet_tables(df)
    for table in df_tables:
        if not table.empty:
            # Get Title and Account No.
            top_row = table.iloc[0]
            count = 0 # This is the position of the column
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
            sheet_data.append(table.to_dict(orient='records'))
    
    # Remove empty tables
    sheet_data = [table for table in sheet_data if len(table) > 0]
    # If General Ledger is empty and its the only table, add a default row
    if len(sheet_data) == 0:
        sheet_data.append([{header: '' for header in ['DATE', '', 'ITEMS', 'P/R', 'DEBIT', 'CREDIT', 'BALANCE', 'Title', 'Account No.']}])

    return sheet_data

def get_sheet_tables(df):
    df_tables = []
    index_row = 0
    for _, row in df.iterrows():
        # Check if row is null or empty string
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

def read_chart_of_accounts(sheet, sheetname):
    df = pd.read_excel(sheet, sheetname)
    df = df.fillna('') # Remove null values
    df_tables = get_sheet_tables(df)

    sheet_data = []
    # Get the tables in the sheet
    for _, table in enumerate(df_tables):
            table_contents = []
            if not table.empty:
                table.columns = range(len(table.columns))
                for _, row in table.iterrows():
                    if row[0] != '':
                        account_no = str(int(row[0]))
                    else:
                        account_no = ''
                    name = str(row[1])
                    # {Account_no (key): Name (value)}
                    table_contents.append({name: account_no})
                if len(table_contents) <= 1:
                    # If Chart of Accounts has no row content, add a default row
                    table_contents.append({'': ''})
                sheet_data.append(table_contents)
    return sheet_data

def get_sheet_widths(filename, sheetname):
    wb = openpyxl.load_workbook(filename)
    sheet_widths = {}

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
    wb.close()

    return widths