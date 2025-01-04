import os
import xlsxwriter
import re

number_regex = re.compile(r'^-?\d+(\.\d+)?$')

# Border Styles
header_cell = {'border': 1, 'bold': True}
edge_cell = {'left': 1, 'right': 1}
center_cell = {'left': 1}
bottom_cell = {'left': 1, 'bottom': 1}

def write_xlsx(filename, tables_widths, data, input_folder):
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

    write_journal(worksheet_journal, workbook, data, tables_widths)
    write_ledger(worksheet_ledger, workbook, data, tables_widths)
    write_chart_of_accounts(worksheet_chart_of_accounts, workbook, data)
    workbook.close()

    if not os.path.exists(input_folder):
        os.makedirs(input_folder)
    if os.path.exists(filename):
        os.replace(filename, os.path.join(input_folder, filename))

def write_journal(worksheet_journal, workbook, data, tables_widths):
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

def write_ledger(worksheet_ledger, workbook, data, tables_widths):
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

def write_chart_of_accounts(worksheet_chart_of_accounts, workbook, data):
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