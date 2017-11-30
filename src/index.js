// --- default stylesheets,
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from "./App";
// Componenets

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
