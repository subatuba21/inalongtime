/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react';
import styles from './confirmForm.module.css';
import Button from 'react-bootstrap/Button';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {setStepUnfinished} from '../../../store/editor';

export const ConfirmForm = () => {
  const [firstStepDone, setFirstStepDone] = useState(false);
  const [secondStepDone, setSecondStepDone] = useState(false);
  const editorState = useSelector(
      (state) => (state as any).editor as DraftFrontendState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStepUnfinished('confirm'));
  }, []);

  const allowedToConfirm =
    (editorState.progress.content === 'finished' &&
        editorState.progress.info === 'finished' &&
        editorState.progress.customize === 'finished');


  return <div id={styles.confirmForm} className='box'>
    <div style={allowedToConfirm ? {display: 'none'} : {}}>
      <p>
        <b>Looks like you still have errors or missing
            info in some sections.</b>
      </p>
    </div>
    <div className={!allowedToConfirm ? styles.disabled : null}>
      <h4>1. Confirm Basic Info</h4>
      <Button onClick={() => setFirstStepDone(true)}
        disabled={!allowedToConfirm}>Confirm</Button>
    </div>
    <div className={!firstStepDone ? styles.disabled : null}>
      <h4>
        2. Confirm Preview
      </h4>
      <p>Is this what you want to see in the future? <a>LINK</a></p>
      <Button onClick={() => setSecondStepDone(true)}
        disabled={!firstStepDone}>Confirm</Button>
    </div>
    <div className={!secondStepDone ? styles.disabled : null}>
      <h4>
        3. Payment
      </h4>
      <p>It looks like your app didn&apos;t fall
            under our free tier because it had over 150 words.
            More details on our pricing here. <br />
            To finish up, click the button below to pay our $2.50 fee.
      </p>
      <Button disabled={!secondStepDone}>Confirm</Button>
    </div>
  </div>;
};
