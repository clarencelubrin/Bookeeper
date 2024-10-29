import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../../features/dataSlice';
import { setWidths } from '../../features/widthsSlice';
import Resizer from './module/Resizer';
import HoverOptions from './module/HoverOptions';
import '../../css/App.css';

function DataSheet({sheet}){
    const dispatch = useDispatch();
    const data = useSelector(state => state.data)['content'];
    let widths = useSelector((state) => state.widths)['content'];
    const calcWidth = [...widths[sheet]];
    useEffect(() => {
        const tableElement = document.querySelector('.data-table');
        if (tableElement && widths[sheet]) {
            const tableWidth = tableElement.offsetWidth;
            calcWidth.map((width, index) => {
                calcWidth[index] = (width*tableWidth)/(100*0.8);
            });
            console.log(calcWidth);
        }
    }, []);
    const [sheet_widths, setSheetWidths] = useState(calcWidth || []);
    useEffect(() => {
        dispatch(setWidths({...widths, [sheet]: sheet_widths}));
    }, [sheet_widths]);
    return(
        <div>
            <h1 className="ml-2 mb-5 mt-5 text-3xl font-bold text-center">{sheet}</h1>
            {data['spreadsheet'][sheet].map((table, index) => ( 
            <DataTable key={index} sheet={sheet} table_index={index} className='data-table'
                sheet_widths={sheet_widths}           // widths (list)
                setSheetWidths={setSheetWidths}/>   // setWidths (function)
            ))}
        </div>
    )
}

function DataTable({ sheet, table_index, sheet_widths, setSheetWidths}) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data)['content'];
    const [checked_rows, setCheckedRows] = useState([]);
    // Functions
    const updateCell = (rowIndex, key, value) => {
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index][rowIndex][key] = value;
        dispatch(setData(updatedData));
    };
    function addRow(row_index){
        const newRow = {};
        Object.entries(data['spreadsheet'][sheet][table_index][0]).forEach(([key]) => {
            newRow[key] = '';
        });
        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData['spreadsheet'][sheet][table_index].splice(row_index + 1, 0, newRow)
        dispatch(setData(updatedData));
        console.log("added row");
    };
    function deleteRow() { 
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
            setCheckedRows([]);
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
            console.log(`Deleted row at index: ${index}`);
        });

        setCheckedRows([]); // Clear the selected rows
        dispatch(setData(updatedData)); // Update the data in the store
    }

    function addDataTable(sheet, table_index){
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
    return (
        <>
            <table className='data-table w-full mt-3 resizable'>
                <thead className='table-header'>
                    <TableHeader sheet={sheet} table_index={table_index} 
                        sheet_widths={sheet_widths}           
                        setSheetWidths={setSheetWidths}/>   
                </thead> 
                <tbody>
                    {data['spreadsheet'][sheet][table_index].map((row, row_index) => (
                        <TableRow row={row} key={row_index} sheet={sheet} row_index={row_index} table_index={table_index} 
                        updateCell={updateCell} addRow={addRow} setCheckedRows={setCheckedRows} /> // updateCell (function) // addRow (function)
                    ))}
                </tbody>
            </table>
            <div className="p-3 mb-1 text-sm bg-white text-gray-700">
                <button className='button-primary' onClick={()=>addRow(data['spreadsheet'][sheet][table_index].length - 1)}>Add row</button>
                <button className='button-violet' onClick={addDataTable(sheet, table_index + 1)}>Add new table</button>
                <button className='button-purple' onClick={deleteRow}>Delete rows</button>
            </div>
        </>
    );
}

function TableHeader({ sheet, table_index, sheet_widths, setSheetWidths }) {
    const data = useSelector(state => state.data)['content'];
    const filteredRow = Object.entries(data['spreadsheet'][sheet][table_index][0]).filter(([key]) => key !== 'Title' && key !== 'Account No.');
    const headers = Object.values(filteredRow).map(([key]) => key);

    useEffect(() => {
        if (sheet_widths.length === 0) {
            const headerWidths = headers.map(header => null);
            setSheetWidths(headerWidths);
        }
    }, [headers, sheet_widths, setSheetWidths]);

    return (
        <tr>
            {headers.map((header, index) => (
                <th className='px-3 py-2 text-sm font-semibold' key={index} style={{width: `${sheet_widths[index]}px`}}>
                    {header}
                    <Resizer setSheetWidths={setSheetWidths} key={index} thIndex={index}/>
                </th>
            ))}
        </tr>
    );
}

function TableRow({ row_index, row, sheet, table_index, updateCell, addRow, setCheckedRows }) {
    const data = useSelector(state => state.data)['content'];
    // Handle hover events
    const [is_hovered, setIsHovered] = useState(false);
    const [is_checked, setIsChecked] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        setCheckedRows((prev) => {
            if (is_checked) {
                return [...prev, row_index].sort((a, b) => a - b);
            } else {
                return prev.filter((index) => index !== row_index).sort((a, b) => a - b);
            }
        });
    }, [is_checked]);

    useEffect(() => {
        setIsChecked(false);
    }, [data['spreadsheet'][sheet][table_index].length, row]);  

    let filteredRow = Object.entries(row).filter(([key]) => key !== 'Title' && key !== 'Account No.');
    filteredRow = Object.values(filteredRow);
    return (
        <tr className='table-row'
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            {filteredRow.map(([key, cell], cell_index) => (
                <TableCell column={key} cell={cell} 
                    row_index={row_index} cell_index={cell_index} key={cell_index} 
                    updateCell={updateCell} is_hover={is_hovered} is_checked={is_checked} setIsChecked={setIsChecked} addRow={addRow}/> // updateCell (function, from DataTable) // is_hovered (boolean)
            ))}
        </tr>
    );
}

function TableCell({ cell, row_index, cell_index, column, is_hover, updateCell, addRow, is_checked, setIsChecked }) {
    const data = useSelector(state => state.data)['content'];
    const [value, setValue] = useState(cell);
    useEffect(() => {
        setValue(cell);
    }, [data]);

    const handleChange = (e) => {
        setValue(e.target.value);
        updateCell(row_index, column, e.target.value);
    };
    // Handle hover events
    const [is_hovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    return (
        <td className="table-row-cell py-1 px-2">
            <input className='my-1 pl-1 pr-1 input-primary' value={value} onChange={handleChange}>
            </input>
            {cell_index === 0 && 
            <HoverOptions is_hovered={is_hover} row_index={row_index} is_checked={is_checked} addRow={addRow} setIsChecked={setIsChecked}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}/>}
        </td>
    );
}

export default DataSheet;