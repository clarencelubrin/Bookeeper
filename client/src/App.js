import React, { useState, useEffect } from 'react'
import HomePage from './page/HomePage';
import DocumentPage from './page/DocumentPage';
import Modal from './components/Modals';
import './css/App.css';

function App(){
  // Route
  const [route, setRoute] = useState(window.location.pathname);
  
  useEffect(() => {
    window.addEventListener('popstate', () => {
      setRoute(window.location.pathname);
    });
  }, []);
  
  if (route === '/') {
    return <HomePage />;
  }
  else{
    return <DocumentPage />;
  }
}


export default App
