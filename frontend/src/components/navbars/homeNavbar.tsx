import styles from './indexNavbar.module.css';
import {Link} from 'react-router-dom';

export const LoggedInNavbar = () => {
  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      <div id={styles.navbarMiddle}>
        <Link to='/login'>New</Link>
        <Link to='/signup'>Drafts</Link>
        <Link to='/signup'>Published</Link>
      </div>
      <div id={styles.navbarRight}>
        <Link to='/login' id={styles.loginLink}>Account Info</Link>
        <Link to='/signup' id={styles.signupLink}>Logout</Link>
      </div>
    </div>
  </div>;
};


