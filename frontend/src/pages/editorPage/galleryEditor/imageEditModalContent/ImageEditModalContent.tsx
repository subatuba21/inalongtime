import {useSelector} from 'react-redux';
import {GalleryContent} from 'shared/dist/editor/classes/galleryContent';
import {DraftFrontendState} from 'shared/dist/types/draft';
import editorStyles from '../galleryEditor.module.css';
import styles from './imageEditModalContent.module.css';
import {Button} from 'react-bootstrap';
import {useState} from 'react';

export const AddImageSetting = -1;

export const ImageEditModalContent = (props: {mediaArrayIndex: number}) => {
  const editorState = useSelector(
      (state) => (state as any).editor) as DraftFrontendState;
  const content = editorState.content as GalleryContent;
  const [isDraggedOver, toggleIsDraggedOver] = useState(false);

  const image = (content.mediaResourceArray as {
    description: string;
    mediaResourceURL: string;
  }[]
  )[props.mediaArrayIndex];

  let caption = '';
  let imageUrl = '';
  if (props.mediaArrayIndex !== AddImageSetting) {
    caption = image.description;
    imageUrl = image.mediaResourceURL;
  }

  return <div id={styles.imageEditModalContent}>
    <h3 className={editorStyles.fieldName}>Image Caption</h3>
    <textarea defaultValue={caption}>
    </textarea>
    <br />
    <h3 className={editorStyles.fieldName}>Upload New Media</h3>
    <div id={styles.dragNdrop} style={isDraggedOver ? {opacity: 0.8} : {}}
      onDragOver={() => toggleIsDraggedOver(true)}
      onDragLeave={() => toggleIsDraggedOver(false)}>
      <p>Drag and drop files here or click to upload.</p>
      <input type='file'
        accept='image/jpeg,image/png,video/mp4,audio/mp3'></input>
    </div>
    {
      props.mediaArrayIndex === AddImageSetting ? <></> : <>
        <br />
        <h3 className={editorStyles.fieldName}>Current Media File</h3>
        {imageUrl.trim() != '' ? <img src={imageUrl} alt='Gallery Media' /> :
    <>No file selected</>}
      </>
    }

    <Button>
      {props.mediaArrayIndex === AddImageSetting ? 'Add' : 'Edit'}
    </Button>

  </div>;
};
