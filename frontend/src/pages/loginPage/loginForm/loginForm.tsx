import {FormEvent, useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './loginForm.module.css';
import {login as loginAction} from '../../../store/user';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';
import {CentralErrors, clearError, ErrorState} from '../../../store/error';

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

  useEffect(() => {
    dispatch(clearError(CentralErrors.loginError));
  }, []);

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
      <div>
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
      </div>
      <div>
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
      </div>
      <Button variant='info' id={styles.button} type='submit' style={{
        opacity: processingLogin ? '.5' : '1',
      }}>Log In</Button>
      <p style={{
        fontSize: '10pt',
        margin: '0px',
        padding: '0px',
        marginTop: '13px',
      }}>
        By signing in, you agree to our&nbsp;
        <a href='#'>Terms of Use</a>
        &nbsp;and our&nbsp;
        <a href='#'>Privacy Policy</a>.
      </p>
      {errorState[CentralErrors.loginError]?.message ?
      <p id={styles.errorMessageBox}>
        {errorState[CentralErrors.loginError]?.message}
      </p> : <></>}
    </form>
  </div>;
};
