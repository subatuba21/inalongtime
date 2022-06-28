import {useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './registerForm.module.css';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const register = () => {

  };

  return <form className="box" id={styles.registerForm} onSubmit={register}>
    <h2>Sign Up</h2>
    <div id={styles.container}>
      <div>
        <InputBox placeholder='First Name' name='firstname' valueState={
          {value: firstName, set: setFirstName}}></InputBox>
      </div>
      <div>
        <InputBox placeholder='Last Name' name='lastname' valueState={
          {value: lastName, set: setLastName}}></InputBox>
      </div>
      <div className={styles.fullRow}>
        <InputBox placeholder='Email' name='email' valueState={
          {value: email, set: setEmail}}></InputBox>
      </div>
      <div>
        <InputBox placeholder='Password' name='password' valueState={
          {value: password, set: setPassword}}></InputBox>
      </div>
      <div>
        <InputBox placeholder='Re-enter Password' name='repassword' valueState={
          {value: password2, set: setPassword2}}></InputBox>
      </div>
    </div>
    <Button variant='info' id={styles.button}>Sign Up</Button>
  </form>;
};
