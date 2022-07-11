import Button from 'react-bootstrap/esm/Button';
import {Link} from 'react-router-dom';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {IndexNavbar} from '../../components/navbars/indexNavbar';
import {RegisterForm} from './registerForm/registerForm';
import styles from './registerPage.module.css';

export const RegisterPage = () => {
  return <div>
    <div className='fillPage'>
      <IndexNavbar></IndexNavbar>
      <RegisterForm></RegisterForm>
      <div className={`${styles.centeredDiv} block-centered`}>
        <Button variant='primary'>
          <img src='/g-logo.png' id={styles.googleLogo}></img>
          Sign Up With Google
        </Button>
      </div>
      <div className={`${styles.centeredDiv} block-centered whiteText`}>
      Have an account? <Link className='pinkText' to='/login'>Log in.</Link>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
