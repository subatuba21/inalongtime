
import {useSelector} from 'react-redux';
import {ReminderContent} from 'shared/dist/editor/classes/reminderContent';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {changeContent, saveDraft,
  setStepFinished, setStepUnfinished} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';
import styles from './reminderEditor.module.css';

export const ReminderEditor = () => {
  const dispatch = useAppDispatch();
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  let content = editorState.content as ReminderContent;

  if (!content || !(content instanceof ReminderContent)) {
    content = new ReminderContent() as ReminderContent;
    content.initialize({
      subject: '',
      text: '',
    });
    dispatch(changeContent(content));
  }

  if (content.subject && content.subject?.trim() !== '' &&
  content.text && content.text?.trim() !== '') {
    dispatch(setStepFinished('content'));
  } else dispatch(setStepUnfinished('content'));


  const onSubjectChange : React.ChangeEventHandler<HTMLTextAreaElement> =
    (event) => {
      const newContent = new ReminderContent();
      newContent.initialize(
          {subject: event.currentTarget.value,
            text: content.text || '',
          });

      dispatch(changeContent(newContent));
    };

  const onMessageChange : React.ChangeEventHandler<HTMLTextAreaElement> =
    (event) => {
      const newContent = new ReminderContent();
      newContent.initialize(
          {
            subject: content.subject || '',
            text: event.currentTarget.value,
          });

      dispatch(changeContent(newContent));
    };

  const save = () => dispatch(saveDraft('data'));

  return <div className='box' id={styles.mainDiv}>
    <span className={styles.fieldName}>Reminder Subject</span>
    <textarea name="subject" onChange={onSubjectChange} onBlur={save}
      defaultValue={content.subject || ''} rows={8}>
    </textarea>
    <br/>
    <br/>
    <span className={styles.fieldName}>Reminder Message</span>
    <textarea name="message" onChange={onMessageChange} onBlur={save}
      defaultValue={content.text || ''} rows={8}>
    </textarea>
  </div>;
};
