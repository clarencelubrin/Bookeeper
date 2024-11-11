/*
    tableScripts
    - This function processes the table data and returns the updated table data and style
        Input: sheet (str), table_data (2d list), table_index (list), data (dict)
        Output: updated table_data (2d list), table_style (2d list)
*/
export function tableScripts(sheet: string, input_table_data: String[][][], table_index: Number, data: object){
    let table_data: String[][][] = [];
    let table_style: String[][] = [];

    // Variables for row scripts
    let prev_row: String[][] = [];
    input_table_data.map((row, row_index) => {
        const { row_data, row_style } = rowScripts(sheet, row, row_index, prev_row, data);
        table_data.push(row_data);      // Push new row_data to table_data
        table_style.push(row_style);    // Push new row_style to table_style
        prev_row = row_data;
    });
    return { table_data, table_style };
}

/*
    RowScripts
    - This function processes the row data and returns the updated row data and style
        Input: sheet (str), row_data (2d list), row_index (list), data (dict)
        Output: updated row_data (2d list), row_style (2d list)
*/

function rowScripts(sheet, input_row_data, row_index, prev_row, data) {
    let row_style: String[] = [];
    let row_data: String[][] = [];
    const input_row_data_dict = input_row_data; // snapshot of the row_data {column_title: cell_value}
    input_row_data = Object.entries(input_row_data).filter(([key]) => key !== 'Title' && key !== 'Account No.');
    
    input_row_data.map((cell, cell_index) => {
        const [column_title, value] = cell;
        const out = cellScript(sheet, column_title, value, row_index, input_row_data, data, prev_row);
        let new_value: string = out.value;
        let new_style: string = out.style;

// -------------------------- Scripts for General Journal --------------------------
        if (sheet === 'General Journal') {
            if (column_title.toLowerCase() === 'p/r') {
                // Auto P/R
                const description = input_row_data_dict['DESCRIPTION'];
                const description_index = Object.keys(input_row_data_dict).indexOf('DESCRIPTION');
                const new_pr = autoPR(description, data);
                if (new_pr !== '') {
                    new_value = autoPR(description, data);
                    row_style[description_index] = row_style[description_index].replace('italic', ''); // Remove italic style
                }
            }
        }
        row_style.push(new_style);                  // Push new style to row_style
        row_data.push([column_title, new_value]);   // Push new value to row_data
    });
    return { row_data: row_data as String[][], row_style: row_style as String[] };
}

function cellScript(sheet, column_title, value, row_index, row_data, data, prev_row): {value: string, style: string} {
    let style = ''; // initialize style

    const row_data_dict = listToDict(row_data); // snapshot of the row_data {column_title: cell_value}

    value = blankRowSolution(value, column_title); 
    if (column_title.toLowerCase() === 'debit' || column_title.toLowerCase() === 'credit' || column_title.toLowerCase() === 'balance') {
        value = autoComma(value);
    }
// -------------------------- Scripts for General Journal --------------------------
    if (sheet === 'General Journal') {
        if (column_title.toLowerCase() === 'description'){
            // Auto italicize the description
            let emptyCells = 0;
            row_data.forEach(([cell_title, cell_value], index) => {
                cell_title = cell_title.toLowerCase();
                if (cell_title.toLowerCase() === 'debit' || cell_title.toLowerCase() === 'credit' || cell_title.toLowerCase() === 'balance') {
                    cell_value = toDigit(cell_value);
                }
                if ((cell_value === '' || cell_value === ' ' || cell_value === 0) && cell_title !== 'description') {
                    emptyCells++;
                }
            });
            if (emptyCells === row_data.length - 1) {
                style = 'italic';
            }
            // Auto tab the description
            const creditCell = toDigit(row_data_dict['CREDIT']);
            if (creditCell && value[0] !== '\t') {
                value = '\t' + value;
            } 
            else {
                value = value.replace('\t', '');
            }
        }

    }
// -------------------------- Scripts for General Ledger --------------------------------
    if (sheet === 'General Ledger') {
        if (column_title.toLowerCase() === 'balance'){
            const prev_balance = toDigit(listToDict(prev_row)['BALANCE'] || 0);
            // Calculate the balance
            let debit = toDigit(row_data_dict['DEBIT']) || 0;
            let credit = toDigit(row_data_dict['CREDIT']) || 0;
            value = (debit - credit) + prev_balance;
            value = autoComma(value);
        }
    }
    return {value, style};
}
/*  Blank Row Solution
    - This solves the issue of the title and account number not saving when the table row is empty
        Input: value, column_title
        Output: updated value
*/
function blankRowSolution(value, column_title) {
    value = value.toString() || '';
    if (column_title === 'Account No.' || column_title === 'Title') {
        return value;
    }
    if (value === ' '){
        return value;
    }
    if (value === '') {
        value = ' ';
        return value;
    } 
    value = value[0].replace(" ", '') + value.slice(1);
    return value;
}
/*  To Digit function
    - This converts the value to a digit
        Input: string
        Output: integer
*/
function toDigit(value){
    if (!value) {
        return 0;
    }
    return parseInt(value.toString().replace(/[a-zA-Z]/g, '').replace(/,/g, '')) || 0;
}
/*  Auto Comma function
    - This adds commas to the value
        Input: value
        Output: value with commas
*/
function autoComma(value){
    value = toDigit(value) || '';
    value = value.toLocaleString();
    return value;
}
/*  Auto P/R function
    - This sets the value for the p/r cell
        Input: value (from description), row_index
        Output: updated value of P/R
*/
function autoPR(value, data){
    if (!value) {
        return '';
    }
    const description = value.trim();
    const pr_value = findPR(description, data) || '';
    return pr_value;
}
/*  Find P/R from Chart of Accounts
    - It finds the p/r value (key) using description value (value) from the chart of accounts
        Input: description
        Output: P/R value
*/
function findPR(description, data){
    if (!data) {
        return;
    }
    const chartOfAccountTables = data['spreadsheet']['Chart of Accounts'];
    for (let i = 0; i < chartOfAccountTables.length; i++) {
        for (let j = 0; j < chartOfAccountTables[i].length; j++) {
            let key = Object.keys(chartOfAccountTables[i][j])[0]
            // console.log(key, description.toLowerCase(), chartOfAccountTables[i][j][key]);
            if (key.toLowerCase() === description.toLowerCase()) {
                return chartOfAccountTables[i][j][key];
            }
        }
    }
}
/*
    2D List to Dict
    - This function converts a 2D list to a dictionary
        Input: 2d_list
        Output: dict
*/
function listToDict(list){
    let dict = {};
    if (!list) {
        return dict;
    }
    list.forEach(([key, value]) => {
        dict[key] = value;
    });
    return dict;
}