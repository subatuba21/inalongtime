import styles from './indexNavbar.module.css';
import {Link} from 'react-router-dom';

export const IndexNavbar = () => {
  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      <div id={styles.navbarRight}>
        <Link to='/login' id={styles.loginLink}>Log In</Link>
        <Link to='/signup' id={styles.signupLink}>Sign Up</Link>
      </div>
    </div>
  </div>;
};
