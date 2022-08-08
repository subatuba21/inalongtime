import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import styles from './recievedPage.module.css';

export const RecievedPage = () => {
  return (
    <div>
      <div className="fillPage">
        <Navbar></Navbar>
        <div id={styles.mainDiv}>
          <h2 className='pinkText'>Recieved</h2>

        </div>
        <BottomBuffer></BottomBuffer>
      </div>
      <Footer></Footer>
    </div>
  );
};
