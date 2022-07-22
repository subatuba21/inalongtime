import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './basicInfo.module.css';
import {SelectBox} from '../../../components/selectBox/selectBox';
import {DraftFrontendState,
  DraftType, RecipientType} from 'shared/dist/types/draft';
import {draftTypeSchema, recipientTypeSchema} from 'shared/dist/types/draft';
import {changeTitle, saveDraft, changePhoneNumber,
  changeBackupEmail1, changeBackupEmail2,
  changeRecipientEmail,
  changeRecipientType,
  changeContentType,
  setStepUnfinished,
  setStepFinished,
} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';
import {useState} from 'react';

export const BasicInfo = () => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  const dispatch = useAppDispatch();

  const onBlur = () => dispatch(saveDraft('properties'));

  const [formErrorState, setFormErrorState] =
  useState<Record<string, string[]>>({});

  let finished = true;
  for (const item of Object.keys(formErrorState)) {
    if (formErrorState[item].length!=0) {
      dispatch(setStepUnfinished('info'));
      finished = false;
    }
  }

  if (finished) dispatch(setStepFinished('info'));

  return <div id={styles.basicInfo} className='box'>
    <div>
      <span className={styles.fieldName}>Title</span>
      <InputBox name='title' placeholder='A message from the past'
        valueState={{value: editorState.title,
          set: (title: string) => dispatch(changeTitle(title))}}
        onBlur={onBlur}
        validation={{
          formErrorState: {
            set: setFormErrorState,
            value: formErrorState,
          },
          validationFunction: (input: string) => {
            const errors = [];
            if (input.length===0) errors.push('Phone number cannot be blank.');
            return errors;
          },
          showErrors: true,
        }}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Type</span>
      <SelectBox name='title'
        options={draftTypeSchema._def.values
            .map((str) => str[0].toUpperCase() + str.substring(1))}
        values={draftTypeSchema._def.values}
        valueState={{value: editorState.type,
          set: (type: string) =>
            dispatch(changeContentType(type as DraftType))}}
        onChange={onBlur}
      ></SelectBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Recipient</span>
      <SelectBox name='recipient'
        options={['Myself', 'Someone else']}
        values={recipientTypeSchema._def.values}
        valueState=
          {{value: editorState.recipientType,
            set: (type: string) =>
              dispatch(changeRecipientType(type as RecipientType))}}
        onChange={onBlur}
      ></SelectBox>
    </div>
    {editorState.recipientType === 'someone else' ?
      <>
        <br />
        <div>
          <span className={styles.fieldName}>Recipient email</span>
          <InputBox name='Recipient email'
            placeholder='recipientemail@gmail.com'
            valueState={{value: editorState.recipientEmail,
              set: (email: string) => dispatch(changeRecipientEmail(email))}}
            onBlur={onBlur}
          ></InputBox>
        </div>
      </> : <></>
    }
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 1</span>
      <InputBox name='backupemail1' placeholder='backupemail@gmail.com'
        valueState={{value: editorState.backupEmail1, set:
          (email: string) => dispatch(changeBackupEmail1(email))}}
        onBlur={onBlur}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 2</span>
      <InputBox name='backupemail2' placeholder='backupemail2@gmail.com'
        valueState={{value: editorState.backupEmail2,
          set: (email: string) => dispatch(changeBackupEmail2(email))}}
        onBlur={onBlur}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup phone number</span>
      <InputBox name='phonenumber' placeholder='999-999-9999'
        valueState={{value: editorState.phoneNumber,
          set: (ph: string) => dispatch(changePhoneNumber(ph))}}
        onBlur={onBlur}
      ></InputBox>
    </div>
  </div>;
};
