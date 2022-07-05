import Button from 'react-bootstrap/esm/Button';
import {Link} from 'react-router-dom';
import {Footer} from '../../components/footer/footer';
import {IndexNavbar} from '../../components/indexNavbar/indexNavbar';
import {RegisterForm} from './registerForm/registerForm';
import styles from './registerPage.module.css';

export const RegisterPage = () => {
  return <div>
    <div className='fillPage'>
      <IndexNavbar></IndexNavbar>
      <RegisterForm></RegisterForm>
      <div className={`${styles.centeredDiv} block-centered`}>
        <Button variant='primary'>Sign Up With Google</Button>
        <Button variant='primary'>Sign Up With Facebook</Button>
      </div>
      <div className={`${styles.centeredDiv} block-centered whiteText`}>
      Have an account? <Link className='pinkText' to='/login'>Log in.</Link>
      </div>
    </div>
    <Footer></Footer>
  </div>;
};
