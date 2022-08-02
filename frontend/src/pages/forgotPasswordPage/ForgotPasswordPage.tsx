import {Link} from 'react-router-dom';
import {Navbar} from '../../components/navbars/Navbar';
import {ForgotPasswordForm} from './forgotPasswordForm';
import styles from './forgotPasswordPage.module.css';

export const ForgotPasswordPage = () => {
  return <div>
    <div className="fillPage">
      <Navbar type='index'></Navbar>
      <ForgotPasswordForm></ForgotPasswordForm>
      <div className={`block-centered ${styles.centeredDiv} whiteText`}>
        Want to login instead?&nbsp;
        <Link className='pinkText' to='/login'>Click here.</Link>
      </div>
    </div>
  </ div>;
};
