import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../../../slices/dataSlice';

export const FunctionContext = createContext()
export const PropContext = createContext()

export function TableProvider({ table_data, sheet, table_index, sheet_widths, setSheetWidths, children}) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data)['content'];
    const [checked_rows, setCheckedRows] = useState([]);
    const inputsRef = useRef(null);
    const focusInput = (row_index, cell_index) => {
        const inputs = inputsRef.current;
        if (inputs !== null) {
            const input = inputs[row_index][cell_index];
            if (input !== undefined) {
                input.focus();
            }
        }
    };
    // Functions
    const updateCell = (rowIndex, key, value) => {
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index][rowIndex][key] = value.toString();
        dispatch(setData(updatedData));
    };
    const updateModalCell = (rowIndex, columnIndex, value) => {
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
        dispatch(setData(updatedData)); // Update the Redux store or other state
    };
    const addModalRow = (row_index) =>{
        const newRow = {};
        Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
            newRow[key] = '';
            newRow[''] = newRow[key]; 
            delete newRow[key]; 
        });
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index].splice(row_index + 1, 0, newRow)
        dispatch(setData(updatedData));
    };
    const addRow = (row_index) => {
        const newRow = {};
        Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
            newRow[key] = '';
            
        });
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index].splice(row_index + 1, 0, newRow)
        dispatch(setData(updatedData));
    };
    const addDataTable = (sheet, table_index)=> {
        return () => {
            const newRow = {};
            Object.entries(data['spreadsheet'][sheet][table_index - 1][0]).forEach(([key]) => {
                newRow[key] = '';
            });
            const newTable = [newRow];
            let updatedData = JSON.parse(JSON.stringify(data));
           
            updatedData['spreadsheet'][sheet].splice(table_index, 0, newTable);
            dispatch(setData(updatedData));
        };
    };
    const deleteRow = () => { 
        let updatedData = JSON.parse(JSON.stringify(data));
        let table_length = data['spreadsheet'][sheet][table_index].length;
        function clearRow(index){
            const clearRow = {};
            Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
                clearRow[key] = '';
            });
            const updatedData = JSON.parse(JSON.stringify(data));
            updatedData['spreadsheet'][sheet][table_index][index] = clearRow;
            return updatedData;
        }
        if (table_length <= 1) {
            updatedData = clearRow(0);
            setCheckedRows(()=>[]); // Clear the selected rows
            dispatch(setData(updatedData)); 
            return;
        }

        let check_rows_list = checked_rows; // Copy the checked rows
        if (table_length === checked_rows.length) {
            updatedData = clearRow(table_length - 1);
            check_rows_list = checked_rows.filter((i) => i !== table_length - 1).sort((a, b) => b - a);
        }
        else {
            check_rows_list = checked_rows.sort((a, b) => b - a);
        }

        // Sort indices in descending order before deleting
        check_rows_list.forEach((index, i) => {
            updatedData['spreadsheet'][sheet][table_index].splice(index, 1);
        });

        setCheckedRows(()=>[]); // Clear the selected rows
        dispatch(setData(updatedData)); // Update the data in the store
        return;
    }
    useEffect(()=>{
        // Remove refs of deleted rows
        checked_rows.forEach((index, i) => {
            inputsRef.current = Object.values(inputsRef.current).splice(index, 1);
        });
    }, [data]) // Triggered when data is changed
    
    const function_list = {
        updateCell, 
        addRow,
        deleteRow,
        addDataTable,
        updateModalCell,
        addModalRow,
        setCheckedRows, 
        setSheetWidths, // function to set the widths
        inputsRef,      // reference to the inputs 
        focusInput
    };
    const props_list = {
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