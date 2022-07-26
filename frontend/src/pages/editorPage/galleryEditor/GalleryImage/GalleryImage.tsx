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

  return <div onClick={onClick} className={styles.imageBox}>
    <BaseMediaPlayer src={
      `/api/draft/${editorState._id}/resource/${image.mediaResourceID}`}
    type={image.mimetype} style={{
      width: '100%',
      height: '200px',
      objectFit: 'contain',
    }}></BaseMediaPlayer>
    <p>{image.caption}</p>
    <button>edit</button>
  </div>;
};
