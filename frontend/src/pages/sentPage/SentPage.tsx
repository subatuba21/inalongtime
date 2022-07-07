import {LoggedInNavbar} from '../../components/navbars/homeNavbar';
import styles from './sentPage.module.css';

export const SentPage = () => {
  return <div className="fillPage">
    <LoggedInNavbar></LoggedInNavbar>
    <div id={styles.mainDiv}>
      <h2 className='pinkText'>Stuff you&apos;ve sent to the future</h2>
    </div>

  </div>;
};
