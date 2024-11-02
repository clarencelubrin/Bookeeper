import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../reducers/dataSlice';
import { setWidths } from '../reducers/widthsSlice';
import { setFiles } from '../reducers/fileSlice';
import DataSheet from '../components/DataSheet';
import Navbar from '../components/Navbar';
import Footer from '../ui/Footers/Footer';
import '../css/App.css';

function DocumentPage() {
    const dispatch = useDispatch();
    
    useEffect(() => {
      fetch(window.location.href).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fetchedData) => {
        const data = {'spreadsheet': fetchedData['spreadsheet']};
        const widths = fetchedData['sheet_widths'];
        const file = {'filename': fetchedData['filename'], 'filelist': fetchedData['filelist']};
        dispatch(setData(data)); // Dispatch action to update Redux store
        dispatch(setWidths(widths)); // Dispatch action to update Redux store
        dispatch(setFiles(file)); // Dispatch action to update Redux store
        window.history.pushState({}, '', `/${fetchedData['filename']}`);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      }); 
    }, [])
   
    let data = useSelector((state) => state.data)['content'];
    let widths = useSelector((state) => state.widths)['content'];
    let files = useSelector((state) => state.file)['content'];

    if (!data || !data['spreadsheet']) {
      return <div>Loading...</div>;
    }
    
    return (
      <>
        <Navbar />
        <div className='container mx-auto p-5 h-auto min-h-screen'>
          <div className="h-8"></div>  
          {['General Journal', 'General Ledger'].map((sheet) => (
            <DataSheet sheet={sheet} key={sheet.replace(' ','_')}/>
          ))}
        </div>
        <Footer />
      </>
    )
}
  

export default DocumentPage;
