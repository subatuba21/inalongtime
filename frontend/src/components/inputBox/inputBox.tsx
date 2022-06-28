import styles from './inputBox.module.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {useState} from 'react';
import {XLg} from 'react-bootstrap-icons';

export const InputBox = (props:
  {
    name: string,
    placeholder: string,
    valueState: {value: string, set: Function},
    errors?: {
      formErrorState?: {value: Record<string, string[]>, set: Function}
      validationFunction: (input: string) => string[],
      showErrors?: boolean
    },
    type?: 'password'
  }) => {
  const [errors, setErrors]:
  [string[], React.Dispatch<React.SetStateAction<string[]>>] =
  useState([] as string[]);

  const onChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    props.valueState.set(value);

    if (props.errors) {
      setErrors(props.errors.validationFunction(value));
      if (props.errors.formErrorState) {
        const errorsCopy = {...props.errors.formErrorState.value};
        errorsCopy[props.name] = errors;
        props.errors.formErrorState.set(errorsCopy);
      }
    }
  };

  if (props.errors?.showErrors) {
    const Input = <div style={styles}>
      <input className='inputBox' placeholder={props.placeholder}
        onChange={onChange} type={props.type} style={{
          color: errors.length===0 ? '' : '#fc497f',
          caretColor: 'black',
        }}></input>
    </div>;
    return <OverlayTrigger placement='bottom-start'
      trigger={['hover', 'focus']} overlay={
        <Popover style={{
          display: errors.length===0 ? 'none' : '',
        }}>
          <Popover.Body>
            {errors.map((error: string, index) => {
              return <p key={index} className={styles.errorEntry}>
                <p style={{
                  margin: '0',
                  padding: '0',
                }}>
                  <XLg className={styles.XIcon} width='1em' height='1em'></XLg>
                </p>
                <span>{error}</span>
              </p>;
            })}
          </Popover.Body>
        </Popover>
      }>
      {Input}
    </OverlayTrigger>;
  } else {
    return <div style={styles}>
      <input className='inputBox' placeholder={props.placeholder}
        onChange={onChange} type={props.type}></input>
    </div>;
  }
};
