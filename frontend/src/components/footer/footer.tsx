import {Link} from 'react-router-dom';
import styles from './footer.module.css';
export const BigFooter = () => {
  return <div id={styles.footer}>
    <div id={styles.firstRow}>
      <span id={styles.logo} className='logo'>
        in a long time
      </span>
      <span className={styles.link}>
        Home
      </span>
      <span className={styles.link}>
        FAQs
      </span>
      <span className={styles.link}>
        Blog
      </span>
    </div>

    <div id={styles.columnContainer}>
      <div className={styles.column}>
        <h3>Company</h3>
        <span>About Us</span>
        <span>Blog</span>
      </div>
      <div className={styles.column}>
        <h3>Connect</h3>
        <span>Instagram</span>
        <span>Facebook</span>
        <span>Contact Us</span>
      </div>
    </div>

    <div id={styles.legalDiv}>
      <span>Copyright In a long time</span>
      <span>Privacy Policy</span>
      <span>Terms of Service</span>
      <span>Sitemap</span>
    </div>


  </div>;
};

export const Footer = () => {
  return <div id={styles.smallfooter}>
    <div id={styles.firstRow}>
      <span id={styles.logo} className='logo'>
        in a long time
      </span>
      <Link to="/home" className={styles.link}>
        Home
      </Link>
      <a className={styles.link} href="https://forms.gle/sEXdP3mRKvYz5GJH8" target="_blank" rel="noreferrer">
        Contact Us
      </a>
      <span className={styles.link}>
        Copyright In a long time
      </span>
    </div>
  </div>;
};
