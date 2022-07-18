import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {DontAllowIfLoggedIn} from
  './components/routeGuards/DontAllowIfLoggedIn';
import {LoggedInRouteGuard} from './components/routeGuards/LoggedInRouteGuard';
import {DraftsPage} from './pages/draftsPage/DraftsPage';
import {EditorPage} from './pages/editorPage/editorPage';
import {HomePage} from './pages/homePage/HomePage';
import {LoadingPage} from './pages/loadingPage/loadingPage';
import {LoginPage} from './pages/loginPage/loginPage';
import {RegisterPage} from './pages/registerPage/registerPage';
import {SentPage} from './pages/sentPage/SentPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/buttons.css';
import './css/box.css';
import './api/setup';
import {useEffect, useState} from 'react';
import {authAPI} from './api/auth';
import {useAppDispatch} from './store/store';
import {setUserState} from './store/user';
import {useSelector} from 'react-redux';
import {Modal} from './components/modal/modal';

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const state = useSelector((state) => state);
  (window as any).state = state;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async () => {
      const result = await authAPI.getCurrentUser();
      if (result.success) {
        dispatch(setUserState({
          email: result.user?.email as string,
          firstName: result.user?.firstName as string,
          lastName: result.user?.lastName as string,
          loggedIn: true,
          _id: result.user?._id as string,
        }));
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return isLoading ? <LoadingPage /> :
  <>
    <Modal></Modal>
    <BrowserRouter>
      <Routes>
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

        <Route path='/drafts' element={
          <LoggedInRouteGuard>
            <DraftsPage></DraftsPage>
          </LoggedInRouteGuard>}/>

        <Route path='/draft/:id' element={
          <LoggedInRouteGuard>
            <EditorPage></EditorPage>
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

        <Route path="*" element={<Navigate to='/login'></Navigate>} />
      </Routes>
    </BrowserRouter>
  </>;
};
