import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWidths } from '../../slices/widthsSlice';
import { SheetTable } from './module/DataTable';
import DictTable from './module/DictTable';
import { TableProvider } from './module/TableProvider';
import { RootState } from '../../Store';
import '../../css/App.css';

function DataSheet({sheet}: {sheet:string}) {
    const dispatch = useDispatch();
    const data = useSelector((state:RootState) => state.data)['present']['content'];
    const widths = useSelector((state:RootState) => state.widths)['content'] || {};
    const [sheet_widths, setSheetWidths] = useState(widths[sheet] || []);
    const data_table = data && data['spreadsheet'][sheet] || [];
    useEffect(() => {
        dispatch(setWidths({...widths, [sheet]: sheet_widths}));
    }, [sheet_widths]);
    return(
        <div>
            <h1 className="ml-2 mb-5 text-3xl font-bold text-center">{sheet}</h1>
            {(sheet !== 'Chart of Accounts') ?
            data_table.map((table, index) => ( 
                <TableProvider table_data={table} sheet={sheet} key={index} table_index={index}
                    sheet_widths={sheet_widths}           // widths (list) // setWidths (function)
                    setSheetWidths={setSheetWidths}> 
                    <SheetTable key={index}/>
                </TableProvider>
            ))
            : 
            <div className='grid grid-cols-3 gap-3'>
            {data_table.map((table, index) => ( 
                <TableProvider table_data={table} sheet={sheet} key={index} table_index={index}
                    sheet_widths={[]}
                    setSheetWidths={()=>{}}>              
                    <div className='col-span-1'>
                        <DictTable />                        
                    </div>
                </TableProvider>
            ))}
            </div>
            }
        </div>
    )
}

export default DataSheet;