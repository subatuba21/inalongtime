import React, {Suspense, useEffect, useState} from 'react';
import styles from './editorPage.module.css';
import {useNavigate, useParams} from 'react-router-dom';
import {StepType} from 'shared/dist/types/draft';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {getDraft} from '../../store/editor';
import {activateModal} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import {LoadingPage} from '../loadingPage/loadingPage';
import {BasicInfo} from './basicInfoForm/basicInfo';
import {ConfirmForm} from './confirmForm/ConfirmForm';
import {Step} from './step/step';
import {Spinner} from 'react-bootstrap';

const LetterEditor =
  React.lazy(
      () => import('./letterEditor/LetterEditor')
          .then(({LetterEditor}) => ({default: LetterEditor})));

export const EditorPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
    };

    dispatch(getDraft({
      id: id as string,
      onSuccess: () => {
        setLoading(false);
      },
      onFailure: () => {
        dispatch(activateModal({
          header: 'Error: Unable to get draft.',
          content: <>We were unable to retrieve your draft.
          Please try again later.</>,
          onClose: () => {
            navigate('/drafts');
          },
        }));
      },
    }));
  }, []);

  const [currentStep, setStepState] = useState<StepType>('info');

  const setStep = (name: StepType) => {
    if (name!==currentStep) setStepState(name);
  };

  let content;

  switch (currentStep) {
    case 'info': {
      content = <BasicInfo draftType='letter'></BasicInfo>;
      break;
    }

    case 'content': {
      content =
      <Suspense fallback={
        <div style={{textAlign: 'center', paddingTop: '10vh'}}>
          <Spinner animation={'grow'} style={{color: 'white'}}></Spinner>
        </div>
      }>
        <LetterEditor />;
      </Suspense>;
      break;
    }

    case 'confirm': {
      content = <ConfirmForm></ConfirmForm>;
      break;
    }

    default: {

    }
  }

  if (loading) {
    return <LoadingPage loggedInNavbar={true}></LoadingPage>;
  }

  return <div style={styles}>
    <div className='fillPage'>
      <Navbar></Navbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Draft Editor</h2>
        <p id={styles.autosavedMessage} className='whiteText'>
            All fields are autosaved.
        </p>
        <p id={styles.previewURL}>
          Preview Link: <a href='https://inalongtime.com/preview/sbbbrebf48357bt53h'>https://inalongtime.com/preview/sbbbrebf48357bt53h</a>
        </p>
        <h3 style={{marginBottom: '10px'}}>Steps</h3>
        <div style={{marginBottom: '10px'}}>
          <Step step='info' currentStep={currentStep} setStep={setStep}></Step>
          <Step step='content'
            currentStep={currentStep} setStep={setStep}></Step>
          <Step step='customize'
            currentStep={currentStep} setStep={setStep}></Step>
          <Step step='confirm'
            currentStep={currentStep} setStep={setStep}></Step>
        </div>
        {content}
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
