import styles from './inputBox.module.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {useState, useRef, useEffect, FocusEventHandler} from 'react';
import {XLg} from 'react-bootstrap-icons';
import {Form} from 'react-bootstrap';

export const InputBox = (props:
  {
    name: string,
    placeholder: string,
    valueState: {value?: string, set: Function},
    validation?: {
      formErrorState?: {value: Record<string, string[]>, set: Function}
      validationFunction: (input: string) => string[],
      showErrors?: boolean,
    },
    type?: 'password',
    onBlur?: FocusEventHandler<HTMLInputElement>,
    optional?: {
      defaultValue: string,
    }
  }) => {
  const [errors, setErrors]:
  [string[], React.Dispatch<React.SetStateAction<string[]>>] =
  useState([] as string[]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [optIn, setOptIn] = useState(
      props.valueState.value !== props.optional?.defaultValue);

  const onSwitchChange : React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      if (optIn) {
        props.valueState.set(props.optional?.defaultValue);
      }
      setOptIn(!optIn);
      props.onBlur ? props.onBlur(event as any) : null;
    };

  useEffect(() => {
    if (!props.valueState.value) {
      props.valueState.set('');
    }
    if (props.validation?.formErrorState &&
      props.validation.formErrorState.value[props.name] === undefined) {
      const value = inputRef.current?.value as string;
      errorCheck(value);
    }
  }, [props?.validation?.formErrorState?.value]);

  const errorCheck = (value: string) => {
    if (props.validation) {
      const validationErrors = props.validation.validationFunction(value);
      setErrors(validationErrors);
      if (props.validation.formErrorState) {
        const errorsCopy = {...props.validation.formErrorState.value};
        errorsCopy[props.name] = validationErrors;
        props.validation.formErrorState.set(errorsCopy);
      }
    }
  };

  const onChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    props.valueState.set(value);
    errorCheck(value);
  };

  let inputStyle = {

  };

  if (props.validation?.showErrors) {
    inputStyle = {
      color: errors.length===0 ? '' : '#fc497f',
      caretColor: 'black',
    };
  }

  const InputStage1 = <input className='inputBox'
    placeholder={props.placeholder}
    onChange={onChange} type={props.type}
    ref={inputRef} onBlur={props.onBlur} style={inputStyle}
    value={props.valueState.value}
  />;

  let InputStage2;


  if (props.validation?.showErrors) {
    InputStage2 = <OverlayTrigger placement='bottom-start'
      trigger={['hover', 'focus']} overlay={
        <Popover style={{
          display: errors.length===0 ? 'none' : '',
        }}>
          <Popover.Body>
            {errors.map((error: string, index) => {
              return <div key={index} className={styles.errorEntry}>
                <p style={{
                  margin: '0',
                  padding: '0',
                }}>
                  <XLg className={styles.XIcon} width='1em' height='1em'></XLg>
                </p>
                <span>{error}</span>
              </div>;
            })}
          </Popover.Body>
        </Popover>
      }>
      {InputStage1}
    </OverlayTrigger>;
  } else {
    InputStage2 = <div style={styles}>
      {InputStage1}
    </div>;
  }

  let InputStage3;

  if (props.optional) {
    InputStage3 = <>
      <Form.Switch onChange={onSwitchChange} checked={optIn}></Form.Switch>
      {
        optIn ? InputStage2 : <></>
      }
    </>;
  } else {
    InputStage3 = InputStage2;
  }

  return InputStage3;
};
