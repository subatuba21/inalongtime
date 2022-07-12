import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {Draft} from './Draft';
import styles from './draftsPage.module.css';

export const DraftsPage = () => {
  return <div>
    <div className="fillPage">
      <Navbar></Navbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Drafts</h2>
        <Draft></Draft>
        <Draft></Draft>
        <Draft></Draft>
        <p className={styles.question}>
          <h3 className='pinkText'>Q: Are my drafts available forever?</h3>
          <p className='whiteText'>No. Drafts will be deleted automatically
            one month after they are last edited.
            You can check this date by clicking the
            info button on the draft.
          </p>
        </p>
        <p className={styles.question}>
          <h3 className='pinkText'>Q: How many drafts can I have at a time?</h3>
          <p className='whiteText'>You can have up to three drafts at a time.
          </p>
        </p>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
