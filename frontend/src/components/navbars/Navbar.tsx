import styles from './Navbar.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch} from '../../store/store';
import {logout} from '../../store/user';
import {List} from 'react-bootstrap-icons';
import {useState} from 'react';

export const Navbar = (props?: {type?: 'index' | 'home'}) => {
  const dispatch = useAppDispatch();
  const [isMobileMenuShowing, changeIsMobileMenuShowing] = useState(false);

  let navbarMiddle = <div id={styles.navbarMiddle}>
    <Link to='/home'>New</Link>
    <Link to='/drafts'>Drafts</Link>
    <Link to='/sent'>Sent</Link>
  </div>;

  let navbarRight = <div id={styles.navbarRight}>
    <Link to='/account' id={styles.loginLink}>Account Info</Link>
    <a onClick={() => dispatch(logout())} id={styles.signupLink}>Logout</a>
  </div>;

  let mobileMenu = <div id={styles.mobileMenu}>
    <Link to='/home' className='whiteText'>New</Link>
    <Link to='/drafts' className='whiteText'>Drafts</Link>
    <Link to='/sent' className='whiteText'>Sent</Link>
    <Link to='/account' className='bold whiteText'>Account Info</Link>
    <a onClick={() => dispatch(logout())} className='bold pinkText'>Logout</a>
  </div>;

  if (props?.type==='index') {
    navbarMiddle = <div id={styles.navbarMiddle}>
      <Link to='/login'>Pricing</Link>
      <Link to='/signup'>FAQs</Link>
      <Link to='/signup'>About</Link>
    </div>;

    navbarRight = <div id={styles.navbarRight}>
      <Link to='/login' id={styles.loginLink}>Log In</Link>
      <Link to='/signup' id={styles.signupLink}>Sign Up</Link>
    </div>;

    mobileMenu = <div id={styles.mobileMenu}>
      <Link to='/home' className='whiteText'>Pricing</Link>
      <Link to='/drafts' className='whiteText'>FAQs</Link>
      <Link to='/sent' className='whiteText'>About</Link>
      <Link to='/account' className='bold whiteText'>Login</Link>
      <Link to='/account' className='bold pinkText'>Signup</Link>
    </div>;
  }

  return <div style={styles}>
    <div id={styles.navbar}>
      <div id={styles.navbarLeft} className="logo">
        In a long time
      </div>
      {navbarMiddle}
      {navbarRight}
      <div id={styles.mobileMenuContainer}>
        <>
          <List id={styles.mobileMenuHamburger}
            onClick={() => changeIsMobileMenuShowing(!isMobileMenuShowing)}>
          </List>
          {isMobileMenuShowing ? mobileMenu : <></>}
        </>
      </div>
    </div>
  </div>;
};


