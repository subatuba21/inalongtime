import {useEffect, useState} from 'react';
import {MiniDraft} from 'shared/dist/types/draft';
import {editorAPI} from '../../api/editor';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {LoadingPage} from '../loadingPage/loadingPage';
import {Draft} from './Draft';
import styles from './draftsPage.module.css';

export const DraftsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MiniDraft[]>([]);
  useEffect(() => {
    const getData = async () => {
      const res = await editorAPI.getUserDrafts();
      if (res.success) {
        setData(res.data as MiniDraft[]);
      } else {

      }
      setLoading(false);
    };
    if (loading) {
      getData();
    }
  }, [loading]);

  if (loading) {
    return <LoadingPage loggedInNavbar={true}></LoadingPage>;
  }

  return <div>
    <div className="fillPage">
      <Navbar></Navbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Drafts</h2>
        {data.map((draft, i) => {
          return <Draft key={i} id={draft._id}
            name={draft.title} type={draft.type}
            setLoading={setLoading}></Draft>;
        })}
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
