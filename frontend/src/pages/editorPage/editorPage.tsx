import React, {Suspense, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {DraftResponseBody, StepType} from 'shared/types/draft';
import {editorAPI} from '../../api/editor';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {loadDraft} from '../../store/editor';
import {useAppDispatch} from '../../store/store';
import {LoadingPage} from '../loadingPage/loadingPage';
import {BasicInfo} from './basicInfoForm/basicInfo';
import styles from './editorPage.module.css';
import {Step} from './step/step';

const LetterEditor =
  React.lazy(
      () => import('../../components/letterEditor/LetterEditor')
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

    const getData = async () => {
      const res = await editorAPI.getDraft(id as string);
      if (res.success) {
        dispatch(loadDraft(res.data as DraftResponseBody));
      } else {

      }
      setLoading(false);
    };
    getData();
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
      <Suspense fallback={<LoadingPage></LoadingPage>}>
        <LetterEditor />;
      </Suspense>;
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
