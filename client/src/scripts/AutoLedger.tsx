import { row_type, chart_of_accounts_type, journal_type, ledger_type } from "interfaces/Scripts/AutoLedgeTypes";

export function autoLedger(chart_of_accounts?: chart_of_accounts_type, journal?: journal_type ){
/*
    Auto Ledger Script
     - This function auto fills the General Ledger spreadsheet based on the Chart of accounts and General Journal
*/
    if (chart_of_accounts === undefined || journal === undefined) {
        return undefined
    }
    const accounts = getListOfAccounts(chart_of_accounts);
    let ledger: ledger_type = []
    let modified_journal = fillJournalDates(journal)
    modified_journal.forEach((table, table_index) => {
        accounts.forEach((pair) => {
            const account = Object.keys(pair)[0];
            const number = Object.values(pair)[0];
            let filtered_table: row_type[] = []
            let ledger_row_index = 0
            let previous_row: row_type = {}
            table.forEach((row: row_type, index) => {
                let description = row['DESCRIPTION']?.trim()
                let modified_row = {...row}

                // Push if the account is in the description
                if (description === account.toString().trim()) {
                    // If current date is the same as the previous date, then set date empty
                    if (row['DATE'] === previous_row['DATE']) {
                        modified_row['DATE'] = ''
                    }
                    let item = journal[table_index].slice(index).find((row) => {
                        return isComment(row)
                    })
                    previous_row = row
                    const newRow = { 
                        'DATE': modified_row['DATE'],
                        '': modified_row?.[''] || '',
                        'ITEMS': item ? item['DESCRIPTION'] : '',
                        'P/R':'',
                        'DEBIT': modified_row['DEBIT'],
                        'CREDIT': modified_row['CREDIT'],
                        'BALANCE': '',
                        'Title': account.toString(), 
                        'Account No.': number
                    }
                    ledger_row_index += 1
                    filtered_table.push(newRow)
                }
            })
            if (filtered_table.length !== 0){
                ledger.push(filtered_table)
            }
        });
    })
    return ledger
}


function getListOfAccounts(chart_of_accounts: chart_of_accounts_type){
/*
    Get List of Accounts
     - This function gets the list of accounts from the Chart of Accounts
    Parameters: chart_of_accounts 2D Array of an object
    [
        [
            {Column name: value},
            {Column name: value},
            {Column name: value},
        ],
        [
            {Column name: value},
            {Column name: value},
            {Column name: value},
        ],
    ]
    Output: List of accounts

*/
    let list_of_accounts: row_type[] = [];
    chart_of_accounts.forEach((table) => {
        for (let i = 0; i < table.length; i++) {
            if (i === 0) {
                continue;
            }
            list_of_accounts.push(table[i]);
        } 
    });
    return list_of_accounts;
}

function fillJournalDates(journal: journal_type){
/*
    Format Journal
     - This function formats the journal
*/
    let modified_journal: journal_type = []
    let previous_row: row_type = {}
    journal.forEach((table) => {
        let modified_table: row_type[] = []
        table.forEach((row: row_type) => {
            let modified_row = {...row}
            if (row['DATE'] === undefined ||(typeof row['DATE'] === 'string' && row['DATE'].trim() === '')) {
                modified_row['DATE'] = previous_row['DATE']
            }
            if (row[''] === undefined || (typeof row[''] === 'string' && row[''].trim() === '')) {
                modified_row[''] = previous_row['']
            }
            previous_row = modified_row
            modified_table.push(modified_row)
        })
        modified_journal.push(modified_table)
    })
    return modified_journal
}

function isComment(row: row_type){
    let count = 0
    for (const value of Object.values(row)) {
        const element = value.toString().trim()
        if(element === ''){
            count += 1
        }
    }
    if (count === Object.keys(row).length - 1){
        return true
    }
    return false
}