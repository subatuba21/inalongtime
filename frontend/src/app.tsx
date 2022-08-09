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
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/buttons.css';
import './css/box.css';
import './css/modal.css';
import './css/carousel.css';
import './api/setup';
import {useEffect, useState} from 'react';
import {authAPI} from './api/auth';
import {useAppDispatch} from './store/store';
import {setUserState} from './store/user';
import {useSelector} from 'react-redux';
import {Modal} from './components/modal/modal';
import {AccountPage} from './pages/accountPage/AccountPage';
import {ForgotPasswordPage} from
  './pages/forgotPasswordPage/ForgotPasswordPage';
import {ContentViewer} from './pages/ContentViewer/ContentViewer';
import {SuccessPage} from './pages/successPage/successPage';
import {Head} from './components/Head/Head';
import {SentPage} from './pages/sentPage/SentPage';
import {ReceivedPage} from './pages/receivedPage/ReceivedPage';

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
          method: result.user?.method as string,
        }));
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return isLoading ? <LoadingPage /> :
  <>
    <Head title='' />
    <Modal></Modal>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={
          <DontAllowIfLoggedIn>
            <Head title='Login' />
            <LoginPage></LoginPage>
          </DontAllowIfLoggedIn>
        }/>

        <Route path='/forgot-password' element={
          <DontAllowIfLoggedIn>
            <Head title='Forgot Password' />
            <ForgotPasswordPage></ForgotPasswordPage>
          </DontAllowIfLoggedIn>
        }/>

        <Route path='/signup' element={
          <DontAllowIfLoggedIn>
            <Head title='Signup' />
            <RegisterPage></RegisterPage>
          </DontAllowIfLoggedIn>
        }/>
        <Route path='/home' element={
          <LoggedInRouteGuard>
            <Head title='Home' />
            <HomePage></HomePage>
          </LoggedInRouteGuard>}/>

        <Route path='/drafts' element={
          <LoggedInRouteGuard>
            <Head title='Drafts' />
            <DraftsPage></DraftsPage>
          </LoggedInRouteGuard>}/>

        <Route path='/draft/:id' element={
          <LoggedInRouteGuard>
            <Head title='Editor' />
            <EditorPage></EditorPage>
          </LoggedInRouteGuard>}/>

        <Route path='/preview/:id' element={
          <LoggedInRouteGuard>
            <Head title='Preview' />
            <ContentViewer mode='preview'></ContentViewer>
          </LoggedInRouteGuard>}/>

        <Route path='/future/:id' element={
          <ContentViewer mode='future'></ContentViewer>
        }/>


        <Route path='/sent' element={
          <LoggedInRouteGuard>
            <Head title='Sent' />
            <SentPage></SentPage>
          </LoggedInRouteGuard>}/>

        <Route path='/received' element={
          <LoggedInRouteGuard>
            <Head title='Received' />
            <ReceivedPage />
          </LoggedInRouteGuard>}/>


        <Route path='/account' element={
          <LoggedInRouteGuard>
            <Head title='Account Info' />
            <AccountPage></AccountPage>
          </LoggedInRouteGuard>}/>

        <Route path='/success' element={
          <LoggedInRouteGuard>
            <Head title='Success' />
            <SuccessPage></SuccessPage>
          </LoggedInRouteGuard>}/>

        <Route path='/load' element={
          <LoadingPage></LoadingPage>
        } />

        <Route path="*" element={<Navigate to='/login'></Navigate>} />
      </Routes>
    </BrowserRouter>
  </>;
};
