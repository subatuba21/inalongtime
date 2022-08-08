import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FutureFrontendData} from 'shared/dist/types/future';
import {editorAPI} from '../../api/editor';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {activateModal} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import {LoadingPage} from '../loadingPage/loadingPage';
import {Sent} from './Sent';
import styles from './sentPage.module.css';

export const SentPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FutureFrontendData | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const futureResult = await editorAPI.getSentDrafts();
      if (futureResult.success) {
        setData(futureResult.data);
        setLoading(false);
      } else {
        dispatch(activateModal({
          header: 'Error: Unable to load sent drafts.',
          content: <>
          There was an unknown error while attempting to load your sent drafts.
          Please try again later.</>,
          onClose: () => {
            navigate('/home');
          },
        }));
      }
    };
    getData();
  }, []);

  if (loading) {
    return <LoadingPage loggedInNavbar={true}></LoadingPage>;
  }
  return <div>
    <div className="fillPage">
      <Navbar></Navbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Sent (to the future)</h2>
        {(data as FutureFrontendData).futures.map((draft, i) => {
          return <Sent key={i}
            name={draft.title} type={draft.type}></Sent>;
        })}
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>
  ;
};
