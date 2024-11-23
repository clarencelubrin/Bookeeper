import { useState, useEffect, createContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRowData, addTableData, deleteRowData, updateCellData } from '../../../slices/dataSlice';
import { RootState } from '../../../Store';
import { FunctionContextType, PropContextType, TableProviderProps, defaultFunctionContext, defaultPropContext } from 'interfaces/tableProviderInterface';
import { inputsRefType } from '../../../interfaces/tableProviderInterface';
export const FunctionContext = createContext<FunctionContextType>(defaultFunctionContext);
export const PropContext = createContext<PropContextType>(defaultPropContext);

interface newRowType {
    [key: string]: string;
}
export function TableProvider({ table_data, sheet, table_index, sheet_widths, setSheetWidths, children }: TableProviderProps) {
    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.data)['present']['content'];
    const [checked_rows, setCheckedRows] = useState<number[]>([]);

    const inputsRef = useRef<inputsRefType>([]);
    const focusInput = (row_index: number, cell_index: number) => {
        const input = inputsRef.current[row_index][cell_index];
        input.focus();
    };
    useEffect(() => {
        // console.log(inputsRef.current);
    }, [inputsRef.current]);
    // Functions
    const updateCell = (rowIndex: number, key: string, value: string) => {
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index][rowIndex][key] = value.toString();
        dispatch(updateCellData(updatedData)); // Update the Redux store or other state
    };
    const updateDictCell = (rowIndex: number, columnIndex: number, value: string) => {
        const updatedData = JSON.parse(JSON.stringify(data));
        if (columnIndex === 1) {
            // Change the key at rowIndex to the new key (value)
            const row = updatedData['spreadsheet'][sheet][table_index][rowIndex];
            const oldKey = Object.keys(row)[0]; 
            row[value.toString()] = row[oldKey]; 
            delete row[oldKey]; 
        } 
        else if (columnIndex === 0) {
            // Change the value for a specific key ('Account No.')
            const row = updatedData['spreadsheet'][sheet][table_index][rowIndex];
            const oldKey = Object.keys(row)[0]; 
            updatedData['spreadsheet'][sheet][table_index][rowIndex][oldKey] = value.toString();
        }
        dispatch(updateCellData(updatedData)); // Update the Redux store or other state
    };
    const addDictRow = (row_index: number) => {
        const newRow: newRowType = {};
        data && Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
            newRow[key] = '';
            newRow[''] = newRow[key]; 
            delete newRow[key]; 
        });
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index].splice(row_index + 1, 0, newRow)
        dispatch(addRowData(updatedData));
    };
    const addRow = (row_index: number) => {
        const newRow: newRowType = {};
        data && Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
            newRow[key] = '';
            
        });
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index].splice(row_index + 1, 0, newRow)
        dispatch(addRowData(updatedData));
    };
    const addDataTable = (sheet: string, table_index: number)=> {
        return () => {
            const newRow: newRowType = {};
            data && Object.entries(data['spreadsheet'][sheet][table_index - 1][0]).forEach(([key]) => {
                newRow[key] = '';
            });
            const newTable = [newRow];
            let updatedData = JSON.parse(JSON.stringify(data));
           
            updatedData['spreadsheet'][sheet].splice(table_index, 0, newTable);
            dispatch(addTableData(updatedData));
        };
    };
    const deleteRow = () => { 
        let updatedData = JSON.parse(JSON.stringify(data));
        let table_length: number | null = data ? (data['spreadsheet'][sheet][table_index] as any[]).length : null;
        function clearRow(index: number) {
            const clearRow: newRowType = {};
            data && Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
                clearRow[key] = '';
            });
            const updatedData = JSON.parse(JSON.stringify(data));
            updatedData['spreadsheet'][sheet][table_index][index] = clearRow;
            return updatedData;
        }
        if (table_length && table_length <= 1) {
            updatedData = clearRow(0);
            setCheckedRows(()=>[]); // Clear the selected rows
            dispatch(deleteRowData(updatedData)); // Update the data in the store
            return;
        }
        const clean_checked_rows = [...new Set(checked_rows)].sort((a, b) => b - a); // Remove duplicates
        let check_rows_list = clean_checked_rows; // Copy the checked rows
        if (table_length === clean_checked_rows.length) {
            updatedData = clearRow(table_length - 1);
            check_rows_list = clean_checked_rows.filter((i) => i !== table_length - 1).sort((a, b) => b - a);
        }
        else {
            check_rows_list = clean_checked_rows.sort((a, b) => b - a);
        }

        // Sort indices in descending order before deleting
        console.log(check_rows_list);
        check_rows_list.forEach((index) => {
            if(sheet === 'Chart of Accounts'){
                console.log(updatedData['spreadsheet'][sheet][table_index][index]);
                updatedData['spreadsheet'][sheet][table_index].splice(index, 1);
            }
            else{
                updatedData['spreadsheet'][sheet][table_index].splice(index, 1);
            }
        });
        dispatch(deleteRowData(updatedData)); // Update the data in the store       
        // Remove refs of deleted rows
        let inputsArray = inputsRef.current ? Object.values(inputsRef.current) : [];
        clean_checked_rows.forEach(() => {inputsArray.pop()});
        inputsRef.current = []; // Reset the inputsRef
        if (inputsRef.current) {
            inputsArray.forEach((values: HTMLInputElement[], index) => {inputsRef.current[index] = values});
        }
        setCheckedRows(() => []); // Remove refs of deleted rows
        return;
    }
    useEffect(()=>{
        // console.log(data['spreadsheet'][sheet], checked_rows);
    }, [data]) // Triggered when data is changed
    
    const function_list: FunctionContextType = {
        updateCell, 
        addRow,
        deleteRow,
        addDataTable,
        updateDictCell,
        addDictRow,
        setCheckedRows, 
        setSheetWidths, // function to set the widths
        inputsRef,      // reference to the inputs 
        focusInput
    };
    const props_list: PropContextType = {
        table_data,
        sheet,          // worksheet name
        table_index,    // index of the table in the worksheet
        sheet_widths,   // list of widths for each column
        checked_rows,   // list of checked rows     
    }
    return (
        <FunctionContext.Provider value={function_list}>
            <PropContext.Provider value={props_list}>
                {children}
            </PropContext.Provider>
        </FunctionContext.Provider>
    );
}