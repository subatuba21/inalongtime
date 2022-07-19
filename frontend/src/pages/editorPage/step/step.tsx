import {useSelector} from 'react-redux';
import {DraftFrontendState, StepType} from 'shared/dist/types/draft';
import styles from './step.module.css';
import {ExclamationOctagon, Check2Circle} from 'react-bootstrap-icons';

export const Step = (props: {step: StepType,
    currentStep: StepType, setStep: (step : StepType) => any}) => {
  const editorState = useSelector(
      (state: any) => state.editor) as DraftFrontendState;

  const text : Record<StepType, string> = {
    'info': 'Basic Info',
    'content': 'Content',
    'confirm': 'Confirm',
    'customize': 'Customize',
  };

  const done = editorState.progress[props.step];
  return <div style={styles} className={`${styles.step} ${props.currentStep ===
        props.step ? styles.active : ''}`} onClick={
    () => props.setStep(props.step)
  }>
    {text[props.step]} {done ? <Check2Circle /> : <ExclamationOctagon />}
  </div>;
};
