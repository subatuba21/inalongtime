import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {authAPI} from '../../../api/auth';
import {InputBox} from '../../../components/inputBox/inputBox';
import {activateModal} from '../../../store/modal';
import {useAppDispatch} from '../../../store/store';
import styles from '../AccountPage.module.css';

export const ResetPasswordForm = () => {
  const [password, changePassword] = useState('');
  const [confirmPassword, changeConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const [errors, setErrors]:
  [Record<string, string[]>,
  React.Dispatch<React.SetStateAction<Record<string, string[]>>>] =
  useState({});
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    setProcessing(true);
    event.preventDefault();
    for (const item of Object.keys(errors)) {
      if (errors[item].length!=0) {
        setProcessing(false);
        return;
      }
    }

    if (password !== confirmPassword) {
      dispatch(activateModal({
        header: 'Passwords do not match',
        content: <>Please make sure your passwords match.</>,
      }));
      setProcessing(false);
      return;
    }

    const result = await authAPI.resetPassword(password);
    if (result.success) {
      dispatch(activateModal({
        header: 'Password reset',
        content: <>Your password has been reset</>,
      }));
    } else {
      dispatch(activateModal({
        header: 'Unable to reset password',
        content: <>Unable to reset password due to unknown error.</>,
      }));
    }
    setProcessing(false);
  };

  return <div className="box" id={styles.container}>
    <h3>Reset password</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <InputBox name='password1'
          type='password' valueState={{
            value: password,
            set: changePassword,
          }} placeholder='Password' validation={{
            formErrorState: {
              value: errors,
              set: setErrors,
            },
            validationFunction: (input: string) => {
              const errors : string[] = [];
              if (input.length < 8) {
                errors.push('Password must be at least 8 characters long.');
              }
              return errors;
            },
          }}></InputBox>
        <InputBox name='password2' valueState={{
          value: confirmPassword,
          set: changeConfirmPassword,
        }} placeholder='Re-enter password' type='password'></InputBox>
      </div>
      <Button variant='info' id={styles.button} type='submit' style={{
        opacity: processing ? '.5' : '1',
      }}>Submit</Button>
    </form>
  </div>;
};
