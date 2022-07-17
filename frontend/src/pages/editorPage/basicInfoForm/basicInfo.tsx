import {InputBox} from '../../../components/inputBox/inputBox';
import styles from './basicInfo.module.css';
import {SelectBox} from '../../../components/selectBox/selectBox';
import {DraftFrontendState, DraftType, RecipientType} from 'shared/types/draft';
import {draftTypeSchema,
  editDraftRequestBody,
  EditDraftRequestBody, recipientTypeSchema} from 'shared/dist/types/draft';
import {changeTitle, saveDraft, changePhoneNumber,
  changeBackupEmail1, changeBackupEmail2,
  changeRecipientEmail,
  changeRecipientType,
  changeContentType,
} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';
import {useSelector} from 'react-redux';

export const BasicInfo = (props: {draftType : DraftType}) => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  const dispatch = useAppDispatch();

  const compileBasicInfo = () : EditDraftRequestBody => {
    return editDraftRequestBody.parse({
      properties: editorState,
    });
  };

  return <div id={styles.basicInfo} className='box'>
    <div>
      <span className={styles.fieldName}>Title</span>
      <InputBox name='title' placeholder='A message from the past'
        valueState={{value: editorState.title,
          set: (title: string) => dispatch(changeTitle(title))}}
        onBlur={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Type</span>
      <SelectBox name='title'
        options={['Letter', 'Gallery', 'Journal', 'Reminder', 'Goals']}
        values={draftTypeSchema._def.values}
        valueState={{value: editorState.type,
          set: (type: string) =>
            dispatch(changeContentType(type as DraftType))}}
        onChange={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
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
        onChange={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
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
            onBlur={() => dispatch(saveDraft({
              id: editorState._id,
              data: compileBasicInfo(),
            }))}
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
        onBlur={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup email 2</span>
      <InputBox name='backupemail2' placeholder='backupemail2@gmail.com'
        valueState={{value: editorState.backupEmail2,
          set: (email: string) => dispatch(changeBackupEmail2(email))}}
        onBlur={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
      ></InputBox>
    </div>
    <br />
    <div>
      <span className={styles.fieldName}>Backup phone number</span>
      <InputBox name='phonenumber' placeholder='999-999-9999'
        valueState={{value: editorState.phoneNumber,
          set: (ph: string) => dispatch(changePhoneNumber(ph))}}
        onBlur={() => dispatch(saveDraft({
          id: editorState._id,
          data: compileBasicInfo(),
        }))}
      ></InputBox>
    </div>
  </div>;
};
