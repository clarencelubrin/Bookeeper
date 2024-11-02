import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FunctionContext, PropContext } from '../../DataSheet/module/TableProvider';
import HoverOptions from '../../DataSheet/module/HoverOptions';
// UI imports
import Button from '../../../ui/Buttons/Button';
import TableInput from '../../../ui/Inputs/TableInput';
import { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell } from '../../../ui/DataTable/Table';
import { ButtonTrayContainer, AddButtonCircle, DeleteButtonCircle, AddTableButtonCircle } from '../../../ui/Buttons/TableButtons';
import '../../../css/App.css';


function ModalTable(){
    const { deleteRow, addDataTable, addModalRow } = useContext(FunctionContext);
    const { table_type, table_data, sheet, table_index, setCheckedRows } = useContext(PropContext);

    return(
    <div>
        <Table>
            <TableHead>
                <TableModalHeader />
            </TableHead> 
            <TableBody>
                {table_data.map((row, row_index) => (
                    <TableModalRow row={row} key={row_index} row_index={row_index}/>
                ))}
            </TableBody>
        </Table>
        <ButtonTrayContainer>
            <AddButtonCircle 
                onClick={()=>addModalRow(table_data.length - 1)}/>
            <DeleteButtonCircle 
                onClick={deleteRow}/>
            <AddTableButtonCircle 
                onClick={addDataTable(sheet, table_index + 1)}/>
        </ButtonTrayContainer>    
        <hr className="mt-3"/>
    </div>
    )
}

function TableModalHeader() {
    const { addModalRow } = useContext(FunctionContext);
    const { table_data } = useContext(PropContext);
    return (
        <HeaderRow className="text-center">
            <TableModalCell cell={Object.values(table_data[0])} key={0} cell_index={0} row_index={0}
                inputClass={'text-center font-semibold'} tdClass={"border-0 w-16"} placeholder={""}/>
            <TableModalCell cell={Object.keys(table_data[0])} key={1} cell_index={1} row_index={0}
                inputClass={'text-center font-semibold'} tdClass={"border-0"} placeholder={""}/>
        </HeaderRow>
    );
}
function TableModalRow({row, row_index}){
    const data = useSelector(state => state.data)['content'];
    const { setCheckedRows } = useContext(FunctionContext);
    const { sheet, table_index } = useContext(PropContext);
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
 
    return (
        (row_index !== 0) && 
        <Row
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {[Object.values(row), Object.keys(row)].map((cell, cell_index) => (
                <TableModalCell cell={cell} key={cell_index} cell_index={cell_index} row_index={row_index}
                is_hover={is_hovered} is_checked={is_checked} setIsChecked={setIsChecked}/>
            ))}
        </Row>
    );
}
function TableModalCell({ cell, row_index, cell_index, is_hover, is_checked, setIsChecked, inputClass, tdClass }) {
    const { addModalRow } = useContext(FunctionContext);
    const { updateModalCell, inputsRef, focusInput } = useContext(FunctionContext);

    // Define a ref for the individual input
    const inputRef = useRef(null);
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
        let value = e.target.value;
        updateModalCell(row_index, cell_index, value);
    };

    const handleKeyDown = (e) => {
        console.log("key pressed");
        if (e.key === 'Enter') {            
            if (cell_index === 1 && inputsRef.current[row_index + 1]) {
                focusInput(row_index + 1, 0);
                return;
            } else if (inputsRef.current[row_index] && inputsRef.current[row_index][cell_index + 1]) {
                focusInput(row_index, cell_index + 1);
            }
        }
    };
    
    // Handle hover events
    const [is_hovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    return (
        <Cell className={`${tdClass}`}>
            <TableInput input_type="input" key={cell_index} inputRef={inputRef} value={cell}
                handleChange={handleChange} handleKeyDown={handleKeyDown}
                inputClass={`focus:z-10 pl-1 pr-1 text-center ${inputClass}`}/>
            {cell_index === 0 && 
            <HoverOptions is_hovered={is_hover} row_index={row_index} is_checked={is_checked} addRow={addModalRow} setIsChecked={setIsChecked}
                absolute_position='top-3 left-4'
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}/>}
        </Cell>
    );
}

export default ModalTable;