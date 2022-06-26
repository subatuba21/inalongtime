import Button from 'react-bootstrap/esm/Button';
import {Footer} from '../../components/footer/footer';
import {IndexNavbar} from '../../components/indexNavbar/indexNavbar';
import {RegisterBox} from './registerBox/registerBox';
import styles from './registerPage.module.css';

export const RegisterPage = () => {
  return <div>
    <div className='fillPage'>
      <IndexNavbar></IndexNavbar>
      <RegisterBox></RegisterBox>
      <div className={`${styles.centeredDiv} block-centered`}>
        <Button variant='primary'>Sign Up With Google</Button>
        <Button variant='primary'>Sign Up With Facebook</Button>
      </div>
      <div className={`${styles.centeredDiv} block-centered`}>
      Have an account? <a className='pinkText'>Log In.</a>
      </div>
    </div>
    <Footer></Footer>
  </div>;
};
