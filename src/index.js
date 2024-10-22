import { BrowserRouter as Router} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import App from './App';
import './index.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);


reportWebVitals();
