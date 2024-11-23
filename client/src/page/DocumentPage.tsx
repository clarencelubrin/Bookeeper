import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { initData } from '../slices/dataSlice';
import { setWidths } from '../slices/widthsSlice';
import { setFiles } from '../slices/fileSlice';
import DataSheet from '../components/DataSheet';
import Loading from '../components/Loading/Loading';
import { RootState } from '../Store';
import '../css/App.css';

interface DocumentPageProps {
    className: string;
    currentSheet: string;
}
function DocumentPage({className, currentSheet}: DocumentPageProps) {
    const dispatch = useDispatch();
    const [xlxs_width, setXlxsWidth] = React.useState({}); // Save the original xlxs width
    useEffect(() => {
    console.log(window.location.href.split('/').pop(), 'this is the file name from document page');
    axios.get(`api/${window.location.href.split('/').pop()}` || '')
      .then((response) => {
          const fetchedData = response.data;
          
          const data = { 'spreadsheet': fetchedData['spreadsheet'] };
          const widths = fetchedData['sheet_widths'];
          const file = {
            'filename': fetchedData['filename'],
            'filelist': fetchedData['filelist']
          };
          // Update local state and Redux store
          setXlxsWidth(widths);
          dispatch(initData(data));
          dispatch(setWidths(widths));
          dispatch(setFiles(file));
  
          // Update browser history
          window.history.pushState({}, '', `/${fetchedData['filename']}`);
      })
      .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
      });
    }, [])

    const data = useSelector((state: RootState) => state.data)['present']['content'];
    const widths = useSelector((state: RootState) => state.widths)['content'];
    const files = useSelector((state: RootState) => state.file.content) as { filelist: string[], filename: string };
    const tableElement = document.querySelector<HTMLElement>('.data-table');
    useEffect(() => {     
      const calculateWidth = (widths: { [key: string]: number[] }) => {
        if (!tableElement) {
          return;
        }
        let calcWidths: { [key: string]: number[] } = {};
        Object.keys(widths).map((sheet: string) => {
          const width: number[] = widths[sheet];
          let calcWidth: number[] = [...width];
          if (tableElement && width) {
            const tableWidth = tableElement.offsetWidth;
            calcWidth.map((cell_width, index) => {
                calcWidth[index] = (cell_width*tableWidth)/(100*0.8);
            });
          }
          calcWidths[sheet] = calcWidth;
        });
        return calcWidths;
      };
      const calculated_widths = calculateWidth(xlxs_width);
      if (calculated_widths !== widths){
        dispatch(setWidths(calculated_widths)); // Dispatch action to update Redux store
      }
    }, [tableElement, xlxs_width]);

    // Loading
    if (!data || !data['spreadsheet'] || !files || Object.keys(files).length === 0) {
      return <Loading />;
    }

    return (
      <div className={`overflow-y-auto ${className}`}>
        <div className={`container p-5 mb-5 mx-auto`}>
            <DataSheet sheet={currentSheet} key={currentSheet.replace(' ','_')}/>
        </div>        
      </div>
    )
}
  

export default DocumentPage;
