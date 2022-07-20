/* eslint-disable no-unused-vars */
import {useState} from 'react';
import styles from './confirmForm.module.css';
import Button from 'react-bootstrap/Button';
export const ConfirmForm = () => {
  const [firstStepDone, setFirstStepDone] = useState(false);
  const [secondStepDone, setSecondStepDone] = useState(false);
  return <div id={styles.confirmForm} className='box'>
    <div>
      <h4>1. Confirm Basic Info</h4>
      <Button onClick={() => setFirstStepDone(true)}>Confirm</Button>
      <div className={!firstStepDone ? styles.disabled : null}>
        <h4>
        2. Confirm Preview
        </h4>
        <p>Is this what you want to see in the future? <a>LINK</a></p>
        <Button onClick={() => setSecondStepDone(true)}>Confirm</Button>
      </div>
      <div className={!secondStepDone ? styles.disabled : null}>
        <h4>
        3. Payment
        </h4>
        <p>It looks like your app didn&apos;t fall
            under our free tier because it had over 150 words.
            More details on our pricing here. <br />
            To finish up, click the button below to pay our $2.50 fee.
        </p>
        <Button>Confirm</Button>
      </div>
    </div>
  </div>;
};
