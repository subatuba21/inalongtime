import {useSelector} from 'react-redux';
import {GalleryContent, MediaResourceArray}
  from 'shared/dist/editor/classes/galleryContent';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {activateModal} from '../../../../store/modal';
import {useAppDispatch} from '../../../../store/store';
import {ImageEditModalContent} from
  '../imageEditModalContent/ImageEditModalContent';
import {BaseMediaPlayer}
  from '../../../../components/BaseMediaPlayer/baseMediaPlayer';
import styles from '../galleryImage.module.css';
import {ArrowLeft, ArrowRight, Pencil, XLg} from 'react-bootstrap-icons';
import {changeContent, saveDraft} from '../../../../store/editor';
import {editorAPI} from '../../../../api/editor';

export const GalleryImage = (props: {mediaArrayIndex: number}) => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  const dispatch = useAppDispatch();
  const content = editorState.content as GalleryContent;
  const image = (content.mediaResourceArray as MediaResourceArray
  )[props.mediaArrayIndex];

  const onClick = () => {
    dispatch(activateModal({
      header: 'Edit Gallery Image',
      content: <ImageEditModalContent
        mediaArrayIndex={props.mediaArrayIndex} />,
    }));
  };

  const moveLeft = () => {
    if (props.mediaArrayIndex > 0) {
      const newMediaArray = content.mediaResourceArray as MediaResourceArray;
      const temp = newMediaArray[props.mediaArrayIndex];
      newMediaArray[props.mediaArrayIndex] =
      newMediaArray[props.mediaArrayIndex - 1];
      newMediaArray[props.mediaArrayIndex - 1] = temp;
      const contentToChange = new GalleryContent();
      contentToChange.initialize({
        mediaResourceArray: newMediaArray,
        description: content.description ? content.description : '',
      });
      dispatch(changeContent(contentToChange));
      dispatch(saveDraft('data'));
    }
  };

  const moveRight = () => {
    const newMediaArray = content.mediaResourceArray as MediaResourceArray;
    if (props.mediaArrayIndex < newMediaArray.length - 1) {
      const temp = newMediaArray[props.mediaArrayIndex];
      newMediaArray[props.mediaArrayIndex] =
      newMediaArray[props.mediaArrayIndex + 1];
      newMediaArray[props.mediaArrayIndex + 1] = temp;
      const contentToChange = new GalleryContent();
      contentToChange.initialize({
        mediaResourceArray: newMediaArray,
        description: content.description ? content.description : '',
      });
      dispatch(changeContent(contentToChange));
      dispatch(saveDraft('data'));
    }
  };

  const onDelete = () => {
    dispatch(activateModal({
      header: 'Delete Gallery Media',
      content: <>Are you sure you want to delete this media?</>,
      successButton: {
        text: 'Delete',
        onClick: async () => {
          await editorAPI.deleteResource(
              editorState._id, image.mediaResourceID);
          const newMediaArray =
            content.mediaResourceArray as MediaResourceArray;
          newMediaArray.splice(props.mediaArrayIndex, 1);
          const contentToChange = new GalleryContent();
          contentToChange.initialize({
            mediaResourceArray: newMediaArray,
            description: content.description ? content.description : '',
          });
          dispatch(changeContent(contentToChange));
          dispatch(saveDraft('data'));
        },
      },
    }));
  };

  return <div className={styles.container}>
    <div onClick={onClick} className={styles.imageBox}>
      <BaseMediaPlayer src={
        `/api/draft/${editorState._id}/resource/${image.mediaResourceID}`}
      type={image.mimetype} style={{
        width: '100%',
        height: '200px',
        objectFit: 'contain',
      }}></BaseMediaPlayer>
      <p>{image.caption}</p>
    </div>
    <div className={styles.toolbar}>
      <ArrowLeft onClick={moveLeft}/>
      <Pencil onClick={onClick}/>
      <XLg onClick={onDelete}/>
      <ArrowRight onClick={moveRight}/>
    </div>
  </div>;
};
