
import {useSelector} from 'react-redux';
import {ReminderContent} from 'shared/dist/editor/classes/reminderContent';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {changeContent, saveDraft} from '../../../store/editor';
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
      defaultValue={content.subject || ''}>
    </textarea>
    <span className={styles.fieldName}>Reminder Message</span>
    <textarea name="message" onChange={onMessageChange} onBlur={save}
      defaultValue={content.text || ''}>
    </textarea>
  </div>;
};
