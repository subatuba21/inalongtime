/* eslint-disable no-unused-vars */
import {FormEvent, useEffect, useRef, useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import {useSelector} from 'react-redux';
import {InputBox} from '../../../components/inputBox/inputBox';
import {addError, CentralError, CentralErrors,
  clearError, ErrorState} from '../../../store/error';
import {useAppDispatch} from '../../../store/store';
import {register as registerAction} from '../../../store/user';
import styles from './registerForm.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const captchaRef = useRef<ReCAPTCHA>(null);
  const errorState = useSelector((state) => (state as any).error) as ErrorState;
  const errorMessageBox = useRef<HTMLParagraphElement>(null);
  const [errors, setErrors]:
  [Record<string, string[]>,
  React.Dispatch<React.SetStateAction<Record<string, string[]>>>] =
  useState({});
  const [processingRegister, setProcessingRegister] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearError(CentralErrors.signupError));
    const matchingPasswordsError = 'matchingPasswordsError';
    const matchingPasswordsErrorMessage = 'Passwords do not match';
    if (password!=password2 && errorMessageBox.current) {
      const errorsCopy = {...errors};
      errorsCopy[matchingPasswordsError] = [matchingPasswordsErrorMessage];
      setErrors(errorsCopy);
      const error : CentralError = {
        type: CentralErrors.signupError,
        message: matchingPasswordsErrorMessage,
      };
      dispatch(addError(error));
    } else {
      dispatch(clearError(CentralErrors.signupError));
      const errorsCopy = {...errors};
      errorsCopy[matchingPasswordsError] = [];
      setErrors(errorsCopy);
    };
  }, [password, password2]);

  const register = (event: FormEvent)=> {
    setProcessingRegister(true);
    event.preventDefault();
    for (const item of Object.keys(errors)) {
      if (errors[item].length!=0) {
        setProcessingRegister(false);
        return;
      }
    }

    if (!captchaRef.current || !captchaRef.current.getValue()) {
      setProcessingRegister(false);
      return;
    }

    dispatch(registerAction({
      email,
      firstname: firstName,
      lastname: lastName,
      password,
      recaptchaToken: captchaRef.current.getValue() as string,
    }));
    setProcessingRegister(false);
  };

  return <form className="box" id={styles.registerForm} onSubmit={register}>
    <h2>Sign Up</h2>
    <div id={styles.container}>
      <div>
        <InputBox placeholder='First Name' name='firstname' valueState={
          {value: firstName, set: setFirstName}}
        validation={{
          showErrors: true,
          validationFunction: (input) => {
            const errors: string[] = [];
            if (input.length===0) errors.push('First name cannot be blank');
            if (input.includes(' ')) {
              errors.push('First name cannot have spaces');
            }
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
        <InputBox placeholder='Last Name' name='lastname' valueState={
          {value: lastName, set: setLastName}}
        validation={{
          showErrors: true,
          validationFunction: (input) => {
            const errors: string[] = [];
            if (input.length===0) errors.push('Last name cannot be blank');
            if (input.includes(' ')) {
              errors.push('Last name cannot have spaces');
            }
            return errors;
          },
          formErrorState: {
            set: setErrors,
            value: errors,
          },
        }}
        ></InputBox>
      </div>
      <div className={styles.fullRow}>
        <InputBox placeholder='Email' name='email' valueState={
          {value: email, set: setEmail}}
        validation={{
          showErrors: true,
          validationFunction: (input) => {
            const errors: string[] = [];
            if (input.length===0) errors.push('Email cannot be blank');
            if (!String(input)
                .toLowerCase()
                // eslint-disable-next-line max-len
                .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                )) {
              errors.push('Email is invalid');
            }
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
            if (input.length<8) errors.push('Password must be 8 characters');
            if (input.includes(' ')) {
              errors.push('Last name cannot have spaces.');
            }
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
        <InputBox placeholder='Re-enter Password' name='repassword' valueState={
          {value: password2, set: setPassword2}} type='password'
        ></InputBox>
      </div>
    </div>
    <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY as string}
      id={styles.recaptcha}
      onChange={() => {}} ref={captchaRef}></ReCAPTCHA>
    <Button variant='info' id={styles.button} type='submit' style={{
      opacity: processingRegister ? '.5' : '1',
    }}>Sign Up</Button>
    <p ref={errorMessageBox} id={styles.errorMessageBox}>
      {errorState[CentralErrors.signupError] ?
      errorState[CentralErrors.signupError]?.message : ''}
    </p>
  </form>;
};
