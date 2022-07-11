import styles from './inputBox.module.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {useState, useRef, useEffect, FocusEventHandler} from 'react';
import {XLg} from 'react-bootstrap-icons';

export const InputBox = (props:
  {
    name: string,
    placeholder: string,
    valueState: {value: string, set: Function},
    validation?: {
      formErrorState?: {value: Record<string, string[]>, set: Function}
      validationFunction: (input: string) => string[],
      showErrors?: boolean,
    },
    type?: 'password',
    onBlur?: FocusEventHandler<HTMLInputElement>,
  }) => {
  const [errors, setErrors]:
  [string[], React.Dispatch<React.SetStateAction<string[]>>] =
  useState([] as string[]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const value = inputRef.current?.value as string;
    errorCheck(value);
  }, []);

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

  if (props.validation?.showErrors) {
    const Input = <div style={styles}>
      <input className='inputBox'
        placeholder={props.placeholder}
        onChange={onChange} type={props.type} style={{
          color: errors.length===0 ? '' : '#fc497f',
          caretColor: 'black',
        }} ref={inputRef} onBlur={props.onBlur}></input>
    </div>;
    return <OverlayTrigger placement='bottom-start'
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
      {Input}
    </OverlayTrigger>;
  } else {
    return <div style={styles}>
      <input className='inputBox' placeholder={props.placeholder}
        onInput={onChange} type={props.type}
        onBlur={props.onBlur ? props.onBlur : () => null}></input>
    </div>;
  }
};
