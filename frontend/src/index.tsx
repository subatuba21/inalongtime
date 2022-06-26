import React from 'react';
import ReactDOM from 'react-dom/client';
// import {LoginPage} from './pages/loginPage/loginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/buttons.css';
import './css/box.css';
import {RegisterPage} from './pages/registerPage/registerPage';
// import {LoginPage} from './pages/loginPage/loginPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
      <RegisterPage></RegisterPage>
    </React.StrictMode>,
);
