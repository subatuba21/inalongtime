import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import styles from './successPage.module.css';

export const SuccessPage =
    () => {
      return <div>
        <div className='fillPage'>
          <Navbar type='home'></Navbar>
          <div style={{
            textAlign: 'center',
            position: 'absolute',
            width: '100vw',
            height: '88vh',
            top: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: '-1',
          }}>
            <h1 className='whiteText' style={
              {marginBottom: '0px'}}>Well done!</h1>
            <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle
                className={styles.checkmarkCircle}
                cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.checkmarkCheck} fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <p className='whiteText' style={{maxWidth: '350px',
              paddingTop: '10px'}}>
              Your message has been sent to the future!
              You can check on it in the &apos;Sent&apos; page.
            </p>
          </div>
          <BottomBuffer></BottomBuffer>
        </div>
        <Footer></Footer>
      </div>;
    };
