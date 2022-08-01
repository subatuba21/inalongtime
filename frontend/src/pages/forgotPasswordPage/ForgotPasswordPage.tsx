import {Navbar} from '../../components/navbars/Navbar';
import {ForgotPasswordForm} from './forgotPasswordForm';

export const ForgotPasswordPage = () => {
  return <div>
    <div className="fillPage">
      <Navbar type='index'></Navbar>
      <ForgotPasswordForm></ForgotPasswordForm>
    </div>
  </ div>;
};
