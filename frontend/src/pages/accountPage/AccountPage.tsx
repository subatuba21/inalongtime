import {useSelector} from 'react-redux';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {UserState} from '../../store/user';
import {ResetPasswordForm} from './resetPasswordForm/ResetPasswordForm';
import styles from './AccountPage.module.css';

export const AccountPage = () => {
  const userState = useSelector((state) => (state as any).user) as UserState;

  return <div style={styles}>
    <Navbar></Navbar>
    <div className=' fillPage'>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Your Account</h2>
        <div id={styles.infoBox} className='box'>
          <p>Email: {userState.email}</p>
          <p>Name: {userState.firstName + ' ' + userState.lastName}</p>
          <p>Account Method: {userState.method ? userState.method : 'Email'}</p>
        </div>

        {userState.method !== 'google' ?
        <ResetPasswordForm></ResetPasswordForm> : <></>}
      </div>

      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
