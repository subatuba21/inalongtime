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
                        data?.futures.sort((future1, future2) => {
                          return future1.nextSendDate <= future2
                              .nextSendDate ? 1 : -1;
                        })
                            .map((draft, i) => {
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

          <p className={styles.question}>
            <h3 className='pinkText'>Q: Why can&apos;t I view what I sent?</h3>
            <p className='whiteText'>
            If you sent your letter, gallery, etc. to someone else,
            you can view it by clicking on your draft and then clicking the
            &apos;view&apos; button. If you sent it to yourself, you won&apos;t
            be able to view it till the arrival date. We want to be a surprise!
            </p>
          </p>
          <p className={styles.question}>
            <h3 className='pinkText'>Can I delete once I have clicked send?</h3>
            <p className='whiteText'>Not yet, but that will be coming soon.
          If you urgently need to delete a sent draft, please contact us
          at contact@inalongtime.com.
            </p>
          </p>
          <p className={styles.question}>
            <h3 className='pinkText'>Can I edit once I have clicked send?</h3>
            <p className='whiteText'>Editing after you hit send is
            not supported.
            </p>
          </p>
        </div>
        <BottomBuffer></BottomBuffer>
      </div>
      <Footer></Footer>
    </div>
  );
};
