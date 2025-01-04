import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveDocument } from 'components/Route';
<<<<<<< HEAD
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

=======
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
import Undo from 'scripts/Undo';
import Redo from 'scripts/Redo';
import useKeyPress from 'scripts/useKeyPress';
import HomePage from 'page/HomePage';
import DocumentPage from 'page/DocumentPage';
import Navbar from 'components/Navbar';
import Footer from 'ui/Footers/Footer';
import Sidebar from 'components/Sidebar';
import ThemeProvider from 'theme/ThemeProvider';
<<<<<<< HEAD
import { FileSelectorInterface } from 'interfaces/Slices/FileSliceInterface';
=======
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
import { RootState } from './Store';
import 'css/App.css';
function App(){
  // Route
  const [currentSheet, setCurrentSheet] = useState('General Journal');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const data = useSelector((state: RootState) => state.data)['present']['content'];
  const past_data = useSelector((state: RootState) => state.data)['past'];
  const future_data = useSelector((state: RootState) => state.data)['future'];
  const widths = useSelector((state: RootState) => state.widths)['content'];

  let files = useSelector((state: RootState) => state.file.content) as unknown as FileSelectorInterface;

  // Keybinds
  useKeyPress(['Control', 'z'], () => {
    Undo({dispatch, past_data});
  });
  useKeyPress(['Control', 'y'], () => {
    Redo({dispatch, future_data});
  });
  useKeyPress(['Control', 's'], () => {
    saveDocument(files['filename'], data, widths, navigate);
  });

  useEffect(() => {
    window.ipcRenderer.send('log', {message: location.pathname})
  }, [location]);

  return(
<<<<<<< HEAD
    <ThemeProvider current_theme='default-theme'>
      <Routes>
        <Route path='/' element={
          <>
            <Navbar show_dropdown={false} show_navlink={false} show_titletexbox={false} />
            <div className='grid h-screen bg-white'>
              <div className='overflow-y-scroll h-full'>
                <HomePage /> 
                <Footer />
              </div>          
            </div>
          </>
        } />
        <Route path='/:filename' element={
          <>
            <Navbar />
            <div className="h-10"></div>
            <div className='flex h-screen mb-5'>
              <Sidebar className="bg-gray-50 max-w-96" currentSheet={currentSheet} setCurrentSheet={setCurrentSheet} />
              <DocumentPage className="w-full" currentSheet={currentSheet} />
            </div>
          </>
        } />
        <Route path='/undefined' element={
          <>
            <Navbar show_dropdown={false} show_navlink={false} show_titletexbox={false} />
            <div className="h-10"></div>
            <div className='px-4'>
              <h1 className='font-bold text-2xl'>404 Not Found</h1>
              <p>Page not found, restart your application</p>
            </div>          
          </>
        } />
      </Routes>      
=======
    <ThemeProvider current_theme='cute-theme'>
      {route === '/' ? <Navbar show_navlink={false} show_titletexbox={false} /> : <Navbar />} 
      {route === '/' ? 
      <div className='grid h-screen bg-white'>
        <div className='overflow-y-scroll h-full'>
          <HomePage /> 
          <Footer />
        </div>          
      </div>
      : 
      <>
        <div className="h-10"></div>
        <div className='grid h-screen grid-cols-12 mb-5'>
          <Sidebar className="xl:col-span-2 md:col-span-3 bg-gray-50" currentSheet={currentSheet} setCurrentSheet={setCurrentSheet} />
          <DocumentPage className="xl:col-span-10 md:col-span-9 bg-white" currentSheet={currentSheet} />
        </div>
      </>
      }         
>>>>>>> ac3f54320442ceecccc7fa1199d1d7ed160404e3
    </ThemeProvider>
  )
}


export default App
