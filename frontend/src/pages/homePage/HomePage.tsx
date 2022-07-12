/* eslint-disable max-len */
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {LoggedInNavbar} from '../../components/navbars/homeNavbar';
import {FutureType} from './futureType/futureType';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return <div style={styles}>
    <div className=' fillPage'>
      <LoggedInNavbar></LoggedInNavbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>What do you want to send&nbsp;
          <span style={{color: 'lightcyan'}} id={styles.futureText}>
            to the future?
          </span>
        </h2>
        <div id={styles.grid}>
          <FutureType typeId='letter'></FutureType>
          <FutureType typeId='gallery'></FutureType>
          <FutureType typeId='reminder' smallImage={true}></FutureType>
          <FutureType typeId='goals' smallImage={true}></FutureType>
          <FutureType typeId='journal'></FutureType>
        </div>
        <h3 className='pinkText'>Want to send something else?</h3>
        <p className='whiteText'>
          We&apos;re open to ideas! Send an email to contact@inalongtime.com
          and we&apos;ll do our best to accomodate your request!

          Additionally, any other feature requests or feedback you have, please send
          them over to contact@inalongtime.com.
        </p>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
