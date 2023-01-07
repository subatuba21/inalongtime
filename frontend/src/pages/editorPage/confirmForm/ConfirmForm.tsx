/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react';
import styles from './confirmForm.module.css';
import Button from 'react-bootstrap/Button';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {setStepUnfinished} from '../../../store/editor';
import {editorAPI} from '../../../api/editor';
import {activateModal} from '../../../store/modal';
import {Spinner} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

export const ConfirmForm = (props: {
  detailsConfirmed: [boolean, (value: boolean) => void],
  previewConfirmed: [boolean, (value: boolean) => void],
  paymentConfirmed: [boolean, (value: boolean) => void],
  paymentMessageContent: [JSX.Element, (value: JSX.Element) => void],
  openPreview: () => void,
}) => {
  const [firstStepDone, setFirstStepDone] = props.detailsConfirmed;
  const [secondStepDone, setSecondStepDone] = props.previewConfirmed;

  const editorState = useSelector(
      (state) => (state as any).editor as DraftFrontendState);
  const dispatch = useAppDispatch();
  const [thirdStepContent, setThirdStepContent] = props.paymentMessageContent;
  const [thirdStepDone, setThirdStepDone] = props.paymentConfirmed;
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  const onfinishSecondStep = async () => {
    setSecondStepDone(true);
    setThirdStepContent(<>
      <div style={{textAlign: 'center'}}>
        <Spinner animation={'grow'} style={{color: 'black', fontSize: '25px'}}>
        </Spinner>
      </div>
    </>);
    const paidResult = await editorAPI.checkDraftIsPaid(editorState._id);
    if (!paidResult.success) {
      dispatch(activateModal({
        content: <div>Unable to save draft.
          Error: {paidResult?.error?.message || 'unknown.'}</div>,
        header: 'Error: Unable to save draft',
      }));
    }

    setPaid(paidResult.paid);

    if (paidResult.paid === false) {
      setThirdStepContent(<p>
        Good news! Your draft falls into the free tier!
        Once you click the confirm button, your draft will be sent to the
        future!
      </p>);
    } else {
      setThirdStepContent(<p>
        Your draft does not fall into the free tier.
        The reason: {paidResult.reason} You can check our
        pricing details <a href={'https://inalongtime.com/pricing'}>here</a>.
        <br />
        <br />
        Good news: it is only $2.50 + tax! Click the confirm button below
        to pay and send your draft into the future!
      </p>);
    }
  };


  const onFinishThirdStep = async () => {
    setThirdStepDone(true);
    if (paid) {
      const result = await editorAPI.getPaymentLink(editorState._id);
      if (!result.success) {
        dispatch(activateModal({
          content: <div>{result?.error?.message}</div>,
          header: 'Error: Unable to confirm draft',
        }));
        return;
      }
      window.location.assign(result.link as string);
    } else {
      const result = await editorAPI.confirmUnpaidDraft(editorState._id);
      if (!result.success) {
        dispatch(activateModal({
          content: <div>{result?.error?.message}</div>,
          header: 'Error: Unable to confirm draft',
        }));
        return;
      }
      navigate('/success');
    }
  };

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
        <b>Looks like you still have to review some sections.</b>
      </p>
    </div>
    <div className={!allowedToConfirm ? styles.disabled : null}>
      <h4>1. Confirm Basic Info</h4>
      <p>
        <b>Title:</b> {editorState.title}<br />
        <b>Recipient: </b>
        {editorState.recipientType === 'myself' ? 'Myself' :
          editorState.recipientEmail}<br />
        <b>Type:</b> {editorState.type}<br />
        <b>Send Date</b> {editorState.nextSendDate.toLocaleDateString()}<br />
        <b>Phone Number:</b> {editorState.phoneNumber}<br />
        <b>Backup Email:</b> {editorState.backupEmail}<br />
      </p>
      <Button onClick={() => setFirstStepDone(true)}
        disabled={!allowedToConfirm}>
        {firstStepDone ? 'Confirmed' : 'Confirm'}
      </Button>
    </div>
    <div className={!allowedToConfirm ||
      !firstStepDone ? styles.disabled : null}>
      <h4>
        2. Confirm Preview
      </h4>
      <p>Please confirm that the <span
        onClick={() => {
          props.openPreview();
        }}
        className='tw-text-purple tw-font-medium
        tw-cursor-pointer'>
        preview
      </span>
      {' '}is to your liking.</p>
      <Button onClick={onfinishSecondStep}
        disabled={!firstStepDone}>{secondStepDone ? 'Confirmed' : 'Confirm'}
      </Button>
    </div>
    <div className={!allowedToConfirm || !secondStepDone ?
       styles.disabled : null}>
      <h4>
        3. Payment
      </h4>
      {thirdStepContent}
      <Button disabled={!secondStepDone || thirdStepDone}
        onClick={onFinishThirdStep}>Confirm</Button>
    </div>
  </div>;
};
