import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/*CSS STYLES*/
// bootstrap-react
import 'bootstrap/dist/css/bootstrap.min.css';
// datapicker styles 
import "react-datepicker/dist/react-datepicker.css";

//main css styles
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

