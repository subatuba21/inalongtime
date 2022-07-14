import {useState} from 'react';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
// import {LetterEditor} from '../../components/letterEditor/LetterEditor';
import {Navbar} from '../../components/navbars/Navbar';
import {BasicInfo} from './basicInfoForm/basicInfo';
import styles from './editorPage.module.css';
import {Step} from './step/step';
export type StepType = 'info' | 'content' | 'customize' | 'confirm';

export const EditorPage = () => {
  const [currentStep, setStepState] = useState<StepType>('info');

  const setStep = (name: StepType) => {
    if (name!==currentStep) setStepState(name);
  };

  let content;

  switch (currentStep) {
    case 'info': {
      content = <BasicInfo draftType='letter'></BasicInfo>;
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
        <h3>Steps</h3>
        <div style={{marginBottom: '20px'}}>
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
