import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { setData } from '../../../slices/dataSlice';
// Module imports
import Resizer from './Resizer';
import HoverOptions from './HoverOptions';
import TableSubtitle from '../../../ui/DataTable/TableSubtitle';
import { tableScripts } from './TableScripts';
import { RootState } from '../../../Store';
// UI imports
import Button from '../../../ui/Buttons/Button';
import TableInput from '../../../ui/Inputs/TableInput';
import { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell } from '../../../ui/DataTable/Table';
import '../../../css/App.css';
// Contexts
import { FunctionContext, PropContext } from './TableProvider';

export function SheetTable(){
    const { addRow, deleteRow, addDataTable } = useContext(FunctionContext);
    const { table_data, sheet, table_index } = useContext(PropContext);
    const data = useSelector((state:RootState) => state.data)['present']['content'] || {};
    /*
        tableScript
        - Pass the table data then process by the table script and then 
          return the updated table data and style
    */
    const out = tableScripts(sheet, table_data, table_index, data);
    const updated_table_data = out.table_data;
    const updated_table_style = out.table_style;
    return(
    <div>
        {(sheet === 'General Ledger') &&
        <DataTableSubtitle table_index={table_index} />
        }
        <Table>
            <TableHead>
                <DataTableHeader />
            </TableHead> 
            <TableBody>
                {updated_table_data.map((row, row_index) => (
                    <DataTableRow row_data_values={row} row_style={updated_table_style[row_index]} key={row_index} row_index={row_index}/>
                ))}
            </TableBody>
        </Table>
        <div className="flex gap-3 p-3 mb-1 text-sm text-gray-700">
            <Button buttonType="primary" onClick={()=>addRow(table_data.length - 1)}>Add row</Button>
            <Button buttonType="violet" onClick={addDataTable(sheet, table_index + 1)}>Add new table</Button>
            <Button buttonType="purple" onClick={deleteRow}>Delete rows</Button>
        </div>    
    </div>
    )
}
function DataTableHeader() {
    const { setSheetWidths } = useContext(FunctionContext);
    const { table_data, sheet_widths } = useContext(PropContext);
    const filteredRow = Object.entries(table_data[0]).filter(([key]) => key !== 'Title' && key !== 'Account No.');
    const headers = Object.values(filteredRow).map(([key]) => key);
    return (
        <HeaderRow>
            {headers.map((header, index) => (
                <HeaderCell
                    key={index} 
                    style={sheet_widths !== undefined ? { width: `${sheet_widths[index]}px` } : {}}>
                    {header}
                    <Resizer setSheetWidths={setSheetWidths} key={index} thIndex={index}/>
                </HeaderCell>
            ))}
        </HeaderRow>
    );
}
function DataTableRow({ row_data_values, row_style, row_index }) {
    const { setCheckedRows } = useContext(FunctionContext);
    const { table_data } = useContext(PropContext);
    const data = useSelector((state:RootState) => state.data)['present']['content'];
    // Handle hover events
    const [is_hovered, setIsHovered] = useState(false);
    const [is_checked, setIsChecked] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        setIsChecked(false);
        setCheckedRows([]); // Remove refs of deleted rows
    }, [table_data.length]);  

    return (
        <Row
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}>
            {row_data_values.map(([key, cell], cell_index) => (
            <DataTableCell column={key} value={cell} style={row_style[cell_index]}
                row_index={row_index} cell_index={cell_index} key={cell_index} 
                is_hover={is_hovered} is_checked={is_checked} setIsChecked={setIsChecked}/>    

            ))}
        </Row>
    );
}
function DataTableCell({ value, column, style, row_index, cell_index, is_hover, is_checked, setIsChecked }) {
    const { addRow, updateCell, inputsRef, focusInput } = useContext(FunctionContext);
    const { table_data, sheet } = useContext(PropContext);

    const inputRef = useRef(null); // Define a ref for the individual input
    // Register this tableinput to the inputsRef
    useEffect(() => {
        // Initialize the structure for inputsRef if it doesn’t exist
       if (!inputsRef.current) {
           inputsRef.current = {};
       }
       if (!inputsRef.current[row_index]) {
           inputsRef.current[row_index] = [];
       }
       inputsRef.current[row_index][cell_index] = inputRef.current;
    }, [row_index, cell_index]);

   const handleChange = (e) => {
        updateCell(row_index, column, e.target.value);
   };
   const handleKeyDown = (e) => {
       if (e.key === 'Enter') {            
           if (cell_index === Object.keys(table_data[row_index]).filter(key => key !== 'Title' && key !== 'Account No.').length - 1 && inputsRef.current[row_index + 1]) {
               focusInput(row_index + 1, 0);
               return;
           } else if (inputsRef.current[row_index] && inputsRef.current[row_index][cell_index + 1]) {
               focusInput(row_index, cell_index + 1);
           } else {
               addRow(row_index);
           }
       }
   };
    return (
        <Cell>
            <TableInput input_type="input" key={cell_index} inputRef={inputRef} value={value}
                handleChange={handleChange} handleKeyDown={handleKeyDown} style={style}
                inputClass="focus:z-10 my-1 pl-1 pr-1"/>
            {cell_index === 0 && 
            <HoverOptions is_hovered={is_hover} row_index={row_index} is_checked={is_checked} addRow={addRow} setIsChecked={setIsChecked}/>}
        </Cell>
    );
}

function DataTableSubtitle({table_index}) {
    const { table_data } = useContext(PropContext);
    const { updateCell } = useContext(FunctionContext);
    return (
    <TableSubtitle>
        <TableInput input_type="input" key={0} 
            value={table_data[0]['Title']} placeholder="Title" 
            handleChange={(e) => {
                updateCell(0, 'Title', e.target.value);
            }}
            inputClass="sm:col-span-2 col-span-1 b-2 pl-1 pr-1 text-center sm:w-3/4 w-full bg-transparent justify-self-center placeholder:font-normal"/>
        <p className="text-center">ACCOUNT NO.</p>
        <TableInput input_type="input" key={1}  
            value={table_data[0]['Account No.']} placeholder={`${table_index + 1}`} 
            handleChange={(e) => {
                updateCell(0, 'Account No.', e.target.value);
            }}
            inputClass="b-2 pl-1 pr-1 text-center sm:w-3/4 w-full bg-transparent justify-self-center placeholder:font-normal"/>
    </TableSubtitle>);
}