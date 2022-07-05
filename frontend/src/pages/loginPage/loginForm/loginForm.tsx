import {FormEvent, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './loginForm.module.css';
import {login as loginAction} from '../../../store/user';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';
import {CentralErrors, ErrorState} from '../../../store/error';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorState = useSelector((state) => (state as any).error) as ErrorState;
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
      <p id={styles.errorMessageBox}>
        {errorState[CentralErrors.loginError]?.message}
      </p>
    </form>
  </div>;
};
