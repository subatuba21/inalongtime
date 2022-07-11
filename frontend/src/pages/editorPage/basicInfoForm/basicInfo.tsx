import {useState} from 'react';
import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './basicInfo.module.css';
import {SelectBox} from '../../../components/selectBox/selectBox';
import {DraftType} from 'shared/types/draft';
import {save} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';

export const BasicInfo = (props: {draftType : DraftType}) => {
  type RecipientType = 'Myself' | 'Someone Else';

  const options: RecipientType[] = ['Myself', 'Someone Else'];
  const [recipientState, setRecipientState] :
    [RecipientType, React.Dispatch<React.SetStateAction<RecipientType>>] =
    useState(options[0]);
  const [titleState, setTitleState] = useState('');
  const [typeState, setTypeState] :
    [DraftType, React.Dispatch<React.SetStateAction<DraftType>>] =
    useState(props.draftType);
  const [backupEmail, setBackUpEmail] = useState('');
  const [backupEmail2, setBackUpEmail2] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');

  const dispatch = useAppDispatch();

  return <div id={styles.basicInfo} className='box'>
    <div>
      <span className={styles.fieldName}>Title</span>
      <InputBox name='title' placeholder='A message from the past'
        valueState={{value: titleState, set: setTitleState}}
        onBlur={() => dispatch(save())}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Type</span>
      <SelectBox name='title'
        options={['Letter', 'Gallery', 'Journal', 'Reminder', 'Goals']}
        valueState={{value: typeState, set: setTypeState}}
        onChange={() => dispatch(save())}
      ></SelectBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Recipient</span>
      <SelectBox name='recipient'
        options={options}
        valueState=
          {{value: recipientState, set: setRecipientState}}
        onChange={() => dispatch(save())}
      ></SelectBox>
    </div>
    {recipientState === options[1] ?
      <>
        <br />
        <div>
          <span className={styles.fieldName}>Recipient email</span>
          <InputBox name='Recipient email'
            placeholder='recipientemail@gmail.com'
            valueState={{value: backupEmail, set: setBackUpEmail}}
            onBlur={() => dispatch(save())}
          ></InputBox>
        </div>
      </> : <></>
    }
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 1</span>
      <InputBox name='backupemail1' placeholder='backupemail@gmail.com'
        valueState={{value: backupEmail, set: setBackUpEmail}}
        onBlur={() => dispatch(save())}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 2</span>
      <InputBox name='backupemail2' placeholder='backupemail2@gmail.com'
        valueState={{value: backupEmail2, set: setBackUpEmail2}}
        onBlur={() => dispatch(save())}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup phone number</span>
      <InputBox name='phonenumber' placeholder='999-999-9999'
        valueState={{value: phoneNumber, set: setphoneNumber}}
        onBlur={() => dispatch(save())}
      ></InputBox>
    </div>
  </div>;
};
