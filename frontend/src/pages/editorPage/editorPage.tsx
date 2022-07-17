import React, {Suspense, useState} from 'react';
import {StepType} from 'shared/types/draft';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {LoadingPage} from '../loadingPage/loadingPage';
import {BasicInfo} from './basicInfoForm/basicInfo';
import styles from './editorPage.module.css';
import {Step} from './step/step';

const LetterEditor =
  React.lazy(
      () => import('../../components/letterEditor/LetterEditor')
          .then(({LetterEditor}) => ({default: LetterEditor})));

export const EditorPage = () => {
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
      <Suspense fallback={<LoadingPage></LoadingPage>}>
        <LetterEditor />;
      </Suspense>;
      break;
    }

    default: {

    }
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
        <div style={{marginBottom: '0px'}}>
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
