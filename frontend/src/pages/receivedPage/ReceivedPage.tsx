import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FutureFrontendData} from 'shared/dist/types/future';
import {editorAPI} from '../../api/editor';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {activateModal} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import {LoadingPage} from '../loadingPage/loadingPage';
import {Received} from './Received';
import styles from './ReceivedPage.module.css';

export const ReceivedPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FutureFrontendData | undefined>(undefined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const futureResult = await editorAPI.getReceivedDrafts();
      if (futureResult.success) {
        setData(futureResult.data);
        console.log(futureResult.data);
        setLoading(false);
      } else {
        dispatch(activateModal({
          header: 'Error: Unable to load received drafts.',
          content: <>
            There was an unknown error while attempting
            to load your received drafts.
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

  return (
    <div>
      <div className="fillPage">
        <Navbar></Navbar>
        <div id={styles.mainDiv}>
          <h2 className='pinkText'>Received&nbsp;
            <span className='blueText'>from the past</span>
          </h2>
          {
            data?.futures.length === 0 ?
                <h5 className='whiteText'>You have no received drafts.
                Click <Link to='/home' style={{color: 'lightcyan',
                  textDecoration: 'underline'}}>here</Link>
                  &nbsp;to create one.</h5> : (
                    <>
                      <h4 className='whiteText'>Sorted by arrival date
                      (latest first)</h4>
                      {
                        data?.futures.map((draft, i) => {
                          return <Received key={i}
                            name={draft.title} type={draft.type}
                            arrivalDate={draft.nextSendDate}
                            _id={draft._id} senderName={
                              draft.senderName}></Received>;
                        })
                      }
                    </>
                  )
          }
        </div>
        <BottomBuffer></BottomBuffer>
      </div>
      <Footer></Footer>
    </div>
  );
};
