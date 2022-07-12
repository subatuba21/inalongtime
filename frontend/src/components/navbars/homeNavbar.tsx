import styles from './indexNavbar.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch} from '../../store/store';
import {logout} from '../../store/user';

export const LoggedInNavbar = () => {
  const dispatch = useAppDispatch();
  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      <div id={styles.navbarMiddle}>
        <Link to='/home'>New</Link>
        <Link to='/drafts'>Drafts</Link>
        <Link to='/sent'>Sent</Link>
      </div>
      <div id={styles.navbarRight}>
        <Link to='/account' id={styles.loginLink}>Account Info</Link>
        <a onClick={() => dispatch(logout())} id={styles.signupLink}>Logout</a>
      </div>
    </div>
  </div>;
};


