import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import styles from './GalleryEditor.module.css';
import {GalleryContent} from 'shared/dist/editor/classes/galleryContent';
import {changeContent, saveDraft} from '../../../store/editor';
import {useAppDispatch} from '../../../store/store';

export const GalleryEditor = () => {
  const dispatch = useAppDispatch();
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  let content = editorState.content as GalleryContent;
  console.log(content);

  if (!content || !(content instanceof GalleryContent)) {
    content = new GalleryContent() as GalleryContent;
    content.initialize({
      description: '',
      mediaResourceArray: [],
    });
    dispatch(changeContent(content));
  }


  const onDescriptionChange: React.FormEventHandler<HTMLTextAreaElement> =
  (element) => {
    const newContent = new GalleryContent();
    newContent.initialize(
        {description: element.currentTarget.value,
          mediaResourceArray: content.mediaResourceArray || [],
        });

    dispatch(changeContent(newContent));
  };

  return <div className='box' id={styles.mainDiv}>
    <span className={styles.fieldName}>
        Gallery Description/Message (Optional)
    </span>
    <textarea name="description" id="" cols={30}
      rows={10} onInput={onDescriptionChange}
      value={content.description} onBlur={() => dispatch(saveDraft('data'))}>
    </textarea>
    <span className={styles.fieldName}>
        Gallery Images
    </span>
    <div>

    </div>
  </div>;
};