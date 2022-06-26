import Button from 'react-bootstrap/esm/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './loginBox.module.css';

export const LoginBox = () => {
  return <div className="box" id={styles.loginBox}>
    <h2>Log In</h2>
    <div id={styles.container}>
      <InputBox placeholder='Email'></InputBox>
      <InputBox placeholder='Password'></InputBox>
      <Button variant='info' id={styles.button}>Log In</Button>
    </div>
  </div>;
};
