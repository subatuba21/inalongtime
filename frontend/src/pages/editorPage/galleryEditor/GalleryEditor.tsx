import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import styles from './GalleryEditor.module.css';
import {GalleryContent} from 'shared/dist/editor/classes/galleryContent';
import {changeContent, saveDraft} from '../../../store/editor';

export const GalleryEditor = () => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  let content = editorState.content as GalleryContent;

  if (!content || content instanceof GalleryContent) {
    content = new GalleryContent() as GalleryContent;
    content.initialize({
      description: '',
      media: [],
    });
    changeContent(content);
  }


  const onDescriptionChange: React.FormEventHandler<HTMLTextAreaElement> =
  (element) => {
    content.description = element.currentTarget.value;
    changeContent(content);
  };

  return <div className='box' id={styles.mainDiv}>
    <span className={styles.fieldName}>
        Gallery Description/Message (Optional)
    </span>
    <textarea name="description" id="" cols={30}
      rows={10} onChange={onDescriptionChange}
      value={content.description} onBlur={() => saveDraft('data')}>
    </textarea>
    <span className={styles.fieldName}>
        Gallery Images
    </span>
    <div>

    </div>
  </div>;
};
