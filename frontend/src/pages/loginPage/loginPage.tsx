import Button from 'react-bootstrap/esm/Button';
import {Footer} from '../../components/footer/footer';
import {IndexNavbar} from '../../components/indexNavbar/indexNavbar';
import {LoginBox} from './loginBox/LoginBox';
import styles from './loginPage.module.css';

export const LoginPage = () => {
  return <div>
    <div className=' fillPage'>
      <IndexNavbar></IndexNavbar>
      <LoginBox></LoginBox>
      <div className={`${styles.centeredDiv} block-centered`}>
        <Button variant='primary'>Sign Up With Google</Button>
        <Button variant='primary'>Sign Up With Facebook</Button>
      </div>
      <div className={`${styles.centeredDiv} block-centered`}>
      Don&apos;t have an account? <a className='pinkText'>Sign Up.</a>
      </div>
    </div>
    <Footer></Footer>
  </div>;
};
