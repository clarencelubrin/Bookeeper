import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { initData } from '../slices/dataSlice';
import { setWidths } from '../slices/widthsSlice';
import { setFiles } from '../slices/fileSlice';
import DataSheet from '../components/DataSheet';
import Loading from '../components/Loading/Loading';
import { RootState } from '../Store';
import '../css/App.css';
import { useLocation } from 'react-router-dom';

interface DocumentPageProps {
    className: string;
    currentSheet: string;
}
function DocumentPage({className, currentSheet}: DocumentPageProps) {
    const dispatch = useDispatch();
    const location = useLocation();
    const tableElement = document.querySelector<HTMLElement>('.data-table');
    const recentData = useSelector((state: RootState) => state.data)['present']['content'];
    const originalWidths = useRef();
    useEffect(() => {
      if (recentData !== null && recentData?.['spreadsheet'] !== undefined){
        return
      }
      // Send request
      if (window.ipcRenderer) {
        window.ipcRenderer.send('api-fetch', {url: location.pathname.split('/').pop()});
        // Listen for the response from the main process
        const handleResponse = (_: any, response: any) => {
          if (response.success === false) {
            console.error('Error fetching data');
            setTimeout(() => {
                console.log('Retrying...');
                window.location.reload();
            }, 5000);
          }
          const fetchedData = response.data;
          console.log(fetchedData)
          if (!fetchedData) {
            return;
          }
          const data = {'spreadsheet': fetchedData['spreadsheet'] };
          const file = {
            'filename': fetchedData['filename'],
            'filelist': fetchedData['filelist']
          };
          let widths = fetchedData['sheet_widths']
          originalWidths.current = widths;
          dispatch(initData(data));
          dispatch(setFiles(file));    
          dispatch(setWidths(widths));
        };
        
        window.ipcRenderer.on('api-response', handleResponse);

        // Clean up the event listener when the component unmounts
        return () => {
          window.ipcRenderer.removeListener('api-response', handleResponse);
        };
      }
    }, []);

    const data = useSelector((state: RootState) => state.data)['present']['content'];
    const files = useSelector((state: RootState) => state.file.content) as { filelist: string[], filename: string };

    useEffect(() => {
      if (originalWidths.current) {
        const calc_width = calculateWidth(originalWidths.current);
        dispatch(setWidths(calc_width));
      }
    }, [tableElement]);

    function calculateWidth(widths: { [key: string]: number[] }) {
      if (!tableElement) {
        return widths;
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

    // Loading
    if (!data || !data['spreadsheet'] || !files || Object.keys(files).length === 0) {
<<<<<<< HEAD
      return (
      <>
        <Loading />
      </>
      );
=======
      return <Loading />;
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    }

    return (
      <div className={`overflow-y-auto ${className}`}>
        <div className={`container py-4 md:px-4  mb-5 mx-auto`}>
            <DataSheet sheet={currentSheet} key={currentSheet.replace(' ','_')}/>
        </div>        
      </div>
    )
}
  

export default DocumentPage;
