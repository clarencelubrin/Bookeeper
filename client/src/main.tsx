import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from './Store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider> 
  </HashRouter>
)
