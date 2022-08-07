import {ReactNode, Suspense, useEffect, useState, lazy} from 'react';
import styles from './editorPage.module.css';
import {useNavigate, useParams} from 'react-router-dom';
import {DraftFrontendState, StepType} from 'shared/dist/types/draft';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';
import {clearDraft, getDraft} from '../../store/editor';
import {activateModal} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import {LoadingPage} from '../loadingPage/loadingPage';
import {BasicInfo} from './basicInfoForm/basicInfo';
import {ConfirmForm} from './confirmForm/ConfirmForm';
import {Step} from './step/step';
import {Spinner} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {GalleryEditor} from './galleryEditor/GalleryEditor';
import {ArrowUpRightSquareFill} from 'react-bootstrap-icons';
import {ReminderEditor} from './reminderEditor/reminderEditor';
import {CustomizeForm} from './customizeForm/CustomizeForm';

const LetterEditor =
  lazy(() => import('./letterEditor/LetterEditor')
      .then(({LetterEditor}) => ({default: LetterEditor})));

export const EditorPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const editorState = useSelector(
      (state: any) => state.editor) as DraftFrontendState;

  useEffect(() => {
    if (!id) {
      navigate('/');
    };

    dispatch(clearDraft());

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

  let contentEditor : ReactNode = <></>;

  switch (editorState.type) {
    case 'letter': {
      contentEditor = <Suspense fallback={
        <div style={{textAlign: 'center', paddingTop: '10vh'}}>
          <Spinner animation={'grow'} style={{color: 'white'}}></Spinner>
        </div>
      }>
        <LetterEditor />
      </Suspense>;
      break;
    }

    case 'gallery': {
      contentEditor = <GalleryEditor />;
      break;
    }

    case 'reminder': {
      contentEditor = <ReminderEditor />;
      break;
    }

    default: {
      contentEditor = <>Content Type not supported yet</>;
    }
  }

  let content;

  switch (currentStep) {
    case 'info': {
      content = <BasicInfo></BasicInfo>;
      break;
    }

    case 'content': {
      content = contentEditor;
      break;
    }

    case 'customize': {
      content = <CustomizeForm></CustomizeForm>;
      break;
    }

    case 'confirm': {
      content = <ConfirmForm></ConfirmForm>;
      break;
    }

    default: {
      content = <></>;
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
          <a href={`/preview/${id}`} target="_blank" rel="noreferrer">
            <ArrowUpRightSquareFill style={{
              marginRight: '9px',
              position: 'relative',
              bottom: '2px',
              fontSize: '15pt',
            }}></ArrowUpRightSquareFill>
            Open Preview
          </a>
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
        <div id={styles.bottomRow}>
          <div id={styles.nextButton} onClick={() => {
            let nextStep = '';
            switch (currentStep) {
              case 'info': {
                nextStep = 'content';
                break;
              }

              case 'content': {
                nextStep = 'customize';
                break;
              }

              case 'customize': {
                nextStep = 'confirm';
                break;
              }

              case 'confirm': {
                nextStep = 'confirm';
                break;
              }

              default: {
                nextStep = 'info';
              }
            }

            setStep(nextStep as StepType);
            window.scrollTo({
              top: 0,
            });
          }}>
            Next
          </div>
          <div id={styles.bottomPreview}>
            <a href={`/preview/${id}`} target="_blank" rel="noreferrer">
              <ArrowUpRightSquareFill style={{
                marginRight: '9px',
                position: 'relative',
                bottom: '2px',
                fontSize: '15pt',
              }}></ArrowUpRightSquareFill>
            Open Preview
            </a>
          </div>
        </div>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
