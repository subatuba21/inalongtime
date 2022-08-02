import {useSelector} from 'react-redux';
import {DraftFrontendState, StepType} from 'shared/dist/types/draft';
import styles from './step.module.css';
import {ExclamationOctagon, Check2Circle
  , HandIndex} from 'react-bootstrap-icons';

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

  let icon;

  switch (editorState.progress[props.step]) {
    case 'unopened': {
      icon = <HandIndex />;
      break;
    }
    case 'unfinished': {
      icon = <ExclamationOctagon />;
      break;
    }
    case 'finished': {
      icon = <Check2Circle />;
      break;
    }
    default: {
      icon = <></>;
      break;
    }
  };
  return <div style={styles} className={`${styles.step} ${props.currentStep ===
        props.step ? styles.active : ''}`} onClick={
    () => props.setStep(props.step)
  }>
    {text[props.step]} {icon}
  </div>;
};
