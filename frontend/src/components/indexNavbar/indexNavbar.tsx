import styles from './indexNavbar.module.css';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

export const IndexNavbar = () => {
  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      <div id={styles.navbarRight}>
        <Button variant='secondary'
          className={`superRounded ${styles.navButton}`}>
          <Link to='/login'>Log In</Link>
        </Button>
        <Button variant='primary'
          className={`superRounded ${styles.navButton}`}>
          <Link to='/register'>Sign Up</Link>
        </Button>
      </div>
    </div>
  </div>;
};
