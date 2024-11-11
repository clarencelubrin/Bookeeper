import React, { useState, useEffect, useContext, createContext, useRef, Children } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FunctionContext, PropContext } from './TableProvider';
import HoverOptions from './HoverOptions';
import { RootState } from '../../../Store';
// UI imports
import TableInput from '../../../ui/Inputs/TableInput';
import { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell } from '../../../ui/DataTable/Table';
import { ButtonTrayContainer, AddButtonCircle, DeleteButtonCircle, AddTableButtonCircle } from '../../../ui/Buttons/TableButtons';
import '../../../css/App.css';

function DictTable(){
    const { deleteRow, addDataTable, addDictRow } = useContext(FunctionContext);
    const { table_data, sheet, table_index } = useContext(PropContext);
    /* 
        Fix: deleteRow not working
    */
    return(
    <div>
        <Table>
            <TableHead>
                <TableDictHeader />
            </TableHead> 
            <TableBody>
                {table_data.map((row, row_index) => (
                    <TableDictRow row={row} key={row_index} row_index={row_index}/>
                ))}
            </TableBody>
        </Table>
        <ButtonTrayContainer>
            <AddButtonCircle 
                onClick={()=>addDictRow(table_data.length - 1)}/>
            <DeleteButtonCircle 
                onClick={deleteRow}/>
            <AddTableButtonCircle 
                onClick={addDataTable(sheet, table_index + 1)}/>
        </ButtonTrayContainer>    
        <hr className="mt-3"/>
    </div>
    )
}

function TableDictHeader() {
    const { addDictRow } = useContext(FunctionContext);
    const { table_data } = useContext(PropContext);
    return (
        <HeaderRow className="text-center">
            <TableDictCell cell={Object.values(table_data[0])} key={0} cell_index={0} row_index={0} children={null}
                inputClass={'text-center font-semibold'} tdClass={"border-0 w-16"} />
            <TableDictCell cell={Object.keys(table_data[0])} key={1} cell_index={1} row_index={0} children={null}
                inputClass={'text-center font-semibold'} tdClass={"border-0"} />
        </HeaderRow>
    );
}
function TableDictRow({row, row_index}){
    const data = useSelector((state:RootState) => state.data)['present']['content'];
    const { setCheckedRows } = useContext(FunctionContext);
    const { sheet, table_index } = useContext(PropContext);
     // Handle hover events
     const [is_hovered, setIsHovered] = useState(false);
     const [is_checked, setIsChecked] = useState(false);
 
     const handleMouseEnter = () => setIsHovered(true);
     const handleMouseLeave = () => setIsHovered(false);
     let table_length: number | null = data ? (data['spreadsheet'][sheet][table_index] as any[]).length : null;
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
     }, [table_length, row]);  
 
    return (
        (row_index !== 0) && 
        <Row className=''
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {[Object.values(row), Object.keys(row)].map((cell, cell_index) => (
                <RowDictCell cell={cell} key={cell_index} cell_index={cell_index} row_index={row_index}
                is_hover={is_hovered} is_checked={is_checked} setIsChecked={setIsChecked}/>
            ))}
        </Row>
    );
}
interface TableDictCellProps {
    cell: any;
    row_index: number;
    cell_index: number;
    children: React.ReactNode;
    inputClass?: string;
    tdClass?: string;
}
function TableDictCell({ cell, row_index, cell_index, children, inputClass, tdClass }: TableDictCellProps) {
    const { updateDictCell, inputsRef, focusInput } = useContext(FunctionContext);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = e.target.value;
        updateDictCell(row_index, cell_index, value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
    
    return (
        <Cell className={`${tdClass}`}>
            <TableInput input_type="input" key={cell_index} inputRef={inputRef} value={cell}
                handleChange={handleChange} handleKeyDown={handleKeyDown}
                inputClass={`focus:z-10 pl-1 pr-1 text-center ${inputClass}`}/>
            {children}
        </Cell>
    );
}

interface RowDictCellProps {
    cell: any;
    row_index: number;
    cell_index: number;
    is_hover: boolean;
    is_checked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
    inputClass?: string;
    tdClass?: string;
}

function RowDictCell({ cell, row_index, cell_index, is_hover, is_checked, setIsChecked, inputClass, tdClass }: RowDictCellProps){
    const { addDictRow } = useContext(FunctionContext);
   
    // Handle hover events
    const [is_hovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    return(
        <TableDictCell cell={cell} key={cell_index} cell_index={cell_index} row_index={row_index}>
            {cell_index === 0 && 
            <HoverOptions is_hovered={is_hover} row_index={row_index} is_checked={is_checked} addRow={addDictRow} setIsChecked={setIsChecked}
                absolute_position='top-3 left-4'
                // onMouseEnter={handleMouseEnter} 
                // onMouseLeave={handleMouseLeave}
            />}
        </TableDictCell>
    )
}

export default DictTable;