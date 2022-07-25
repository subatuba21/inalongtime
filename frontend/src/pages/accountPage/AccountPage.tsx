import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {InputBox} from '../../components/inputBox/inputBox';
import {Navbar} from '../../components/navbars/Navbar';
import {UserState} from '../../store/user';
import styles from './AccountPage.module.css';

export const AccountPage = () => {
  const userState = useSelector((state) => (state as any).user) as UserState;
  const [firstName, setFirstName] = useState(userState.firstName);
  const [lastName, setLastName] = useState(userState.lastName);

  return <div style={styles}>
    <Navbar></Navbar>
    <div className=' fillPage'>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Your Account</h2>
        <div id={styles.infoBox} className='box'>
          <p>Email: {userState.email}</p>
          <p>Name: {userState.firstName + ' ' + userState.lastName}</p>
          <p>Account Method: {userState.method ? userState.method : 'Email'}</p>
        </div>
        <h3>Change account name</h3>
        <InputBox name='firstname' placeholder='First name'
          valueState={{value: firstName, set: setFirstName}}></InputBox>
        <InputBox name='lastname' placeholder='Last name'
          valueState={{value: lastName, set: setLastName}}></InputBox>

        <Button id={styles.save}>Save Changes</Button>
        {userState.method !== 'google' ?
        <Button id={styles.resetPassword}>Reset Password</Button> :
        <></>}
      </div>

      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
