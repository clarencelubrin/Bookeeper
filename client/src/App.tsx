import { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { saveDocument } from './components/Route';
import Undo from './scripts/Undo';
import Redo from './scripts/Redo';
import useKeyPress from './scripts/useKeyPress';
import HomePage from './page/HomePage';
import DocumentPage from './page/DocumentPage';
import Navbar from './components/Navbar';
import Footer from './ui/Footers/Footer';
import Sidebar from './components/Sidebar';
import ThemeProvider from './theme/ThemeProvider';
import { RootState } from './Store';
import './css/App.css';
function App(){
  // Route
  const [route, setRoute] = useState(window.location.pathname);
  const [currentSheet, setCurrentSheet] = useState('General Journal');

  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.data)['present']['content'];
  const past_data = useSelector((state: RootState) => state.data)['past'];
  const future_data = useSelector((state: RootState) => state.data)['future'];
  const widths = useSelector((state: RootState) => state.widths)['content'];
  // Keybinds
  useKeyPress(['Control', 'z'], () => {
    Undo({dispatch, past_data});
  });
  useKeyPress(['Control', 'y'], () => {
    Redo({dispatch, future_data});
  });
  useKeyPress(['Control', 's'], () => {
    saveDocument(window.location.pathname.split('/').pop() || '', data, widths);
  });
  useEffect(() => {
    window.addEventListener('popstate', () => {
      setRoute(window.location.pathname);
    });
  }, []);

  return(
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
    </ThemeProvider>
  )
}


export default App
