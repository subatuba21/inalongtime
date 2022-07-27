import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './basicInfo.module.css';
import {SelectBox} from '../../../components/selectBox/selectBox';
import {DraftFrontendState,
  DraftType, RecipientType} from 'shared/dist/types/draft';
import {draftTypeSchema, recipientTypeSchema} from 'shared/dist/types/draft';
import {changeTitle, saveDraft, changePhoneNumber,
  changeBackupEmail,
  changeRecipientEmail,
  changeRecipientType,
  changeContentType,
  setStepUnfinished,
  setStepFinished,
  changeSendDate,
} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import DatePicker from 'react-date-picker';
import validate from 'validator';
import 'react-datepicker/dist/react-datepicker.css';

(window as any).validator = validate;

export const BasicInfo = () => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  const dispatch = useAppDispatch();

  const onBlur = () => dispatch(saveDraft('properties'));

  const [formErrorState, setFormErrorState] =
  useState<Record<string, string[]>>({});

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (editorState.nextSendDate<tomorrow) {
    formErrorState['date'] = ['Date must be in the future'];
  } else {
    formErrorState['date'] = [];
  }

  let finished = true;
  for (const item of Object.keys(formErrorState)) {
    if (formErrorState[item] && formErrorState[item].length!=0) {
      if (editorState.recipientType === 'myself' &&
      item === 'Recipient email') {
        continue;
      }
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
            if (input.trim().length===0) errors.push('Title cannot be blank.');
            return errors;
          },
          showErrors: true,
        }}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Type</span>
      <SelectBox name='type'
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
            validation={{
              formErrorState: {
                set: setFormErrorState,
                value: formErrorState,
              },
              validationFunction: (input: string) => {
                const errors = [];
                if (input.length===0) {
                  errors.push('Recipient email cannot be blank.');
                }

                if (!validate.isEmail(input)) {
                  errors.push('Recipient email is not valid.');
                }
                return errors;
              },
              showErrors: true,
            }}
          ></InputBox>
        </div>
      </> : <></>
    }
    <br />
    <div>
      <span className={styles.fieldName}>
        {editorState.recipientType === 'someone else' ?
        'Recipient phone number' : 'Your phone number'}</span>
      <span className={styles.fieldDescription}>Please add country code and
      then 10-digit phone number. Example (US): +18888888888</span>
      <InputBox name='phonenumber' placeholder='999-999-9999'
        valueState={{value: editorState.phoneNumber,
          set: (ph: string) => dispatch(changePhoneNumber(ph))}}
        onBlur={onBlur}
        validation={{
          formErrorState: {
            set: setFormErrorState,
            value: formErrorState,
          },
          validationFunction: (input: string) => {
            const errors = [];
            if (input.length===0) errors.push('Phone number cannot be blank.');

            if (!validate.isMobilePhone(input, 'any', {
              strictMode: true,
            })) {
              errors.push(
                  'Phone number is not valid. (Is the country code correct?)');
            }

            return errors;
          },
          showErrors: true,
        }}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email</span>
      <span className={styles.fieldDescription}>We will send it to this email
      if the recipient hasn&apos;t accessed it through the
      email and phone number provided above.</span>
      <InputBox name='backupemail' placeholder='backupemail@gmail.com'
        valueState={{value: editorState.backupEmail, set:
          (email: string) => dispatch(changeBackupEmail(email))}}
        onBlur={onBlur}
        validation={{
          formErrorState: {
            set: setFormErrorState,
            value: formErrorState,
          },
          validationFunction: (input: string) => {
            const errors = [];
            if (input.length===0) errors.push('Backup email cannot be blank.');

            if (!validate.isEmail(input)) {
              errors.push('Recipient email is not valid.');
            }
            return errors;
          },
          showErrors: true,
        }}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Send date</span>
      <DatePicker value={editorState.nextSendDate}
        onChange={(date: Date) => date ?
          dispatch(changeSendDate(date)) && onBlur() : null}
        minDate={tomorrow}></DatePicker>
    </div>
  </div>;
};
