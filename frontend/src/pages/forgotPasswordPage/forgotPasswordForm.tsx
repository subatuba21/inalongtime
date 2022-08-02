import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {authAPI} from '../../api/auth';
import {InputBox} from '../../components/inputBox/inputBox';
import {activateModal} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import styles from './forgotPasswordPage.module.css';
import validator from 'validator';


export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [processing, setProccessing] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errors, setErrors]:
  [Record<string, string[]>,
  React.Dispatch<React.SetStateAction<Record<string, string[]>>>] =
  useState({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProccessing(true);

    for (const item of Object.keys(errors)) {
      if (errors[item].length!=0) {
        setProccessing(false);
        return;
      }
    }

    const result = await authAPI.forgotPassword(email);
    if (result.success) {
      const onClose = () => {
        navigate('/login');
      };
      dispatch(activateModal({
        header: 'Email sent',
        content: <>Check your email for a link to reset your password.</>,
        onClose,
      }));
    } else {
      dispatch(activateModal({
        header: 'Error',
        content: <>
        There was an error that is preventing you from resetting your password.
        Please try again later.</>,
      }));
    }
    setProccessing(false);
  };

  return <div className="box" id={styles.form}>
    <h2>Forgot Password?</h2>
    <form id={styles.container} onSubmit={handleSubmit}>
      <div>
        <InputBox placeholder='Email' name='email'
          valueState={{value: email, set: setEmail}} validation={
            {
              formErrorState: {
                value: errors,
                set: setErrors,
              },
              validationFunction: (input) => {
                const errors = [];
                if (input.length===0) errors.push('Email cannot be blank');
                if (!validator.isEmail(input)) {
                  errors.push('Email is not valid');
                }
                return errors;
              },
              showErrors: true,
            }
          }></InputBox>
      </div>
      <p>If your account exists, we will email you a
        link you can use to login and reset your password.</p>
      <Button variant='info' id={styles.button} type='submit' style={{
        opacity: processing ? '.5' : '1',
      }}>Submit</Button>
    </form>
  </div>;
};
