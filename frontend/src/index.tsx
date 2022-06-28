import React from 'react';
import ReactDOM from 'react-dom/client';
// import {LoginPage} from './pages/loginPage/loginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/buttons.css';
import './css/box.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {LoginPage} from './pages/loginPage/loginPage';
import {RegisterPage} from './pages/registerPage/registerPage';
import {HomePage} from './pages/homePage/HomePage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
);
