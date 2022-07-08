import React from 'react';
import ReactDOM from 'react-dom/client';
// import {LoginPage} from './pages/loginPage/loginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/buttons.css';
import './css/box.css';
import './api/setup';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {LoginPage} from './pages/loginPage/loginPage';
import {RegisterPage} from './pages/registerPage/registerPage';
import {IndexPage} from './pages/indexPage/IndexPage';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {HomePage} from './pages/homePage/HomePage';
import {LoggedInRouteGuard} from './components/routeGuards/LoggedInRouteGuard';
import {DontAllowIfLoggedIn}
  from './components/routeGuards/DontAllowIfLoggedIn';
import {DraftsPage} from './pages/draftsPage/DraftsPage';
import {SentPage} from './pages/sentPage/SentPage';
import {EditorPage} from './pages/editorPage/editorPage';
import {LoadingPage} from './pages/loadingPage/loadingPage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <DontAllowIfLoggedIn>
                <IndexPage></IndexPage>
              </DontAllowIfLoggedIn>
            }/>
            <Route path='/login' element={
              <DontAllowIfLoggedIn>
                <LoginPage></LoginPage>
              </DontAllowIfLoggedIn>
            }/>
            <Route path='/signup' element={
              <DontAllowIfLoggedIn>
                <RegisterPage></RegisterPage>
              </DontAllowIfLoggedIn>
            }/>
            <Route path='/home' element={
              <LoggedInRouteGuard>
                <HomePage></HomePage>
              </LoggedInRouteGuard>}/>

            <Route path='/hometest' element={
              <HomePage></HomePage>
            } />

            <Route path='/drafttest' element={
              <DraftsPage></DraftsPage>
            } />

            <Route path='/senttest' element={
              <SentPage></SentPage>
            } />

            <Route path='/edittest' element={
              <EditorPage></EditorPage>
            } />

            <Route path='/load' element={
              <LoadingPage></LoadingPage>
            } />
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
);
