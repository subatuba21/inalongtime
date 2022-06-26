import styles from './indexNavbar.module.css';
import Button from 'react-bootstrap/Button';

export const IndexNavbar = () => {
  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      <div id={styles.navbarRight}>
        <Button variant='secondary'
          className={`superRounded ${styles.navButton}`}>Log In</Button>
        <Button variant='primary'
          className={`superRounded ${styles.navButton}`}>Sign Up</Button>
      </div>

    </div>
  </div>;
};
