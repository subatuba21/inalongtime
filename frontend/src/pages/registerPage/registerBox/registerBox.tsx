import Button from 'react-bootstrap/esm/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './registerBox.module.css';

export const RegisterBox = () => {
  return <div className="box" id={styles.registerBox}>
    <h2>Sign Up</h2>
    <div id={styles.container}>
      <div><InputBox placeholder='First Name'></InputBox></div>
      <div><InputBox placeholder='Last Name'></InputBox></div>
      <div className={styles.fullRow}>
        <InputBox placeholder='Email'></InputBox>
      </div>
      <div><InputBox placeholder='Password'></InputBox></div>
      <div><InputBox placeholder='Re-enter password'></InputBox>
      </div>
    </div>
    <Button variant='info' id={styles.button}>Sign Up</Button>
  </div>;
};
