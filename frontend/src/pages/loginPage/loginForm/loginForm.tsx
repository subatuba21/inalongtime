import {FormEvent, useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './loginForm.module.css';
import {login as loginAction, UserState} from '../../../store/user';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorMessageBox = useRef<HTMLParagraphElement>(null);
  const userState = useSelector((state) => (state as any).user) as UserState;
  const [errors, setErrors]:
  [Record<string, string[]>,
  React.Dispatch<React.SetStateAction<Record<string, string[]>>>] =
  useState({});
  const [processingLogin, setProcessingLogin] = useState(false);
  const dispatch = useAppDispatch();

  const login = (event: FormEvent)=> {
    setProcessingLogin(true);
    event.preventDefault();
    for (const item of Object.keys(errors)) {
      if (errors[item].length!=0) {
        setProcessingLogin(false);
        return;
      }
    }

    dispatch(loginAction({
      email,
      password,
    }));

    if (!userState.loggedIn) {
      setProcessingLogin(false);
      if (errorMessageBox.current) {
        errorMessageBox.current.innerHTML =
`Incorrect email or password.&nbsp;
<a class="gradientFinishText"> Forgot Password?</a>`;
      }
    } else {
      alert('loggedIn');
    }
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
      <p ref={errorMessageBox} id={styles.errorMessageBox}></p>
    </form>
  </div>;
};
