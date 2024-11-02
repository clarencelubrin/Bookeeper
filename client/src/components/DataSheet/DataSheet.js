import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWidths } from '../../reducers/widthsSlice';
import { SheetTable } from './module/DataTable';
import { TableProvider } from './module/TableProvider';
import '../../css/App.css';

function DataSheet({sheet}) {
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
            <TableProvider table_data={table} sheet={sheet} key={index} table_index={index} className='data-table'
                sheet_widths={sheet_widths}           // widths (list) // setWidths (function)
                setSheetWidths={setSheetWidths}> 
                <SheetTable key={index}/>  
            </TableProvider>
            ))}
        </div>
    )
}

export default DataSheet;