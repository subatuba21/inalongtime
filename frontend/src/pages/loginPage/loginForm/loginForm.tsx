import {FormEvent, useState} from 'react';
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
  const [processingLogin, setProcessingLogin] = useState(false);


  const login = (event: FormEvent)=> {
    setProcessingLogin(true);
    console.log(errors);
    event.preventDefault();
    setProcessingLogin(false);
  };

  return <div className="box" id={styles.loginForm}>
    <h2>Log In</h2>
    <form id={styles.container} onSubmit={login}>
      <InputBox placeholder='Email' name='email' valueState={
        {value: email, set: setEmail}}
      validation={{
        showErrors: true,
        validationFunction: (input) => {
          const errors: string[] = [];
          if (input.length===0) errors.push('Email cannot be blank');
          return errors;
        },
        formErrorState: {
          set: setErrors,
          value: errors,
        },
      }}
      ></InputBox>
      <InputBox placeholder='Password' name='password' valueState={
        {value: password, set: setPassword}} type='password'
      validation={{
        showErrors: true,
        validationFunction: (input) => {
          const errors: string[] = [];
          if (input.length===0) errors.push('Password cannot be blank');
          return errors;
        },
        formErrorState: {
          set: setErrors,
          value: errors,
        },
      }}
      ></InputBox>
      <Button variant='info' id={styles.button} type='submit' style={{
        opacity: processingLogin ? '.5' : '1',
      }}>Log In</Button>
    </form>
  </div>;
};
