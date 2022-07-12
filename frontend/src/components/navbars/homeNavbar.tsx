import styles from './indexNavbar.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch} from '../../store/store';
import {logout} from '../../store/user';
import {List} from 'react-bootstrap-icons';
import {useState} from 'react';

export const LoggedInNavbar = () => {
  const dispatch = useAppDispatch();
  const [isMobileMenuShowing, changeIsMobileMenuShowing] = useState(false);
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
      <div id={styles.mobileMenuContainer}>
        <List id={styles.mobileMenuHamburger}
          onClick={() => changeIsMobileMenuShowing(!isMobileMenuShowing)}>
        </List>
        {isMobileMenuShowing ?
        <div id={styles.mobileMenu}>
          <Link to='/home' className='whiteText'>New</Link>
          <Link to='/drafts' className='whiteText'>Drafts</Link>
          <Link to='/sent' className='whiteText'>Sent</Link>
          <Link to='/account' className='bold whiteText'>Account Info</Link>
          <Link to='/account' className='bold pinkText'>Logout</Link>

        </div> : <></>
        }
      </div>
    </div>
  </div>;
};


