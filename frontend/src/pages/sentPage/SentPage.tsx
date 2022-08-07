import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import styles from './sentPage.module.css';

export const SentPage = () => {
  return <div className="fillPage">
    <Navbar></Navbar>
    <div id={styles.mainDiv}>
      <h2 className='pinkText'>Stuff you&apos;ve sent to the future</h2>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
