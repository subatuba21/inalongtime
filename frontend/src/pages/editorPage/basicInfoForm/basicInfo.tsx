import {useState} from 'react';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './basicInfo.module.css';
import {SelectBox} from '../../../components/selectBox/selectBox';
import {DraftType} from '../../../../../shared/types/draft';

export const BasicInfo = (props: {draftType : DraftType}) => {
  const [titleState, setTitleState] = useState('');
  const [typeState, setTypeState] :
    [DraftType, React.Dispatch<React.SetStateAction<DraftType>>] =
    useState(props.draftType);
  const [backupEmail, setBackUpEmail] = useState('');
  const [backupEmail2, setBackUpEmail2] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');

  return <div id={styles.basicInfo} className='box'>
    <div>
      <span className={styles.fieldName}>Title</span>
      <InputBox name='title' placeholder='A message from the past'
        valueState={{value: titleState, set: setTitleState}}></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Type</span>
      <SelectBox name='title'
        options={['Letter', 'Gallery', 'Journal', 'Reminder', 'Goals']}
        valueState={{value: typeState, set: setTypeState}}></SelectBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Recipient</span>
      <SelectBox name='recipient'
        options={['Myself', 'Someone else']}
        valueState={{value: typeState, set: setTypeState}}></SelectBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 1</span>
      <InputBox name='backupemail1' placeholder='backupemail@gmail.com'
        valueState={{value: backupEmail, set: setBackUpEmail}}></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 2</span>
      <InputBox name='backupemail2' placeholder='backupemail2@gmail.com'
        valueState={{value: backupEmail2, set: setBackUpEmail2}}></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup phone number</span>
      <InputBox name='phonenumber' placeholder='999-999-9999'
        valueState={{value: phoneNumber, set: setphoneNumber}}></InputBox>
    </div>
  </div>;
};
