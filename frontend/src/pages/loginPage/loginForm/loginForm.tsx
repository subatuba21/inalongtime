import {useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './loginForm.module.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]:
  [Record<string, string[]>,
  React.Dispatch<React.SetStateAction<Record<string, string[]>>>] =
  useState({});


  const login = ()=> {


  };

  return <div className="box" id={styles.loginForm}>
    <h2>Log In</h2>
    <form id={styles.container} onSubmit={login}>
      <InputBox placeholder='Email' name='email' valueState={
        {value: email, set: setEmail}}
      errors={{
        showErrors: false,
        validationFunction: (input) => {
          const errors: string[] = [];
          return errors;
        },
        formErrorState: {
          set: setErrors,
          value: errors,
        },
      }}
      ></InputBox>
      <InputBox placeholder='Password' name='password' valueState={
        {value: password, set: setPassword}} type='password'></InputBox>
      <Button variant='info' id={styles.button} type='submit'>Log In</Button>
    </form>
  </div>;
};
