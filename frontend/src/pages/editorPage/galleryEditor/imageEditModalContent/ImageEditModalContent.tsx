import {useSelector} from 'react-redux';
import {GalleryContent,
  MediaResourceArray} from 'shared/dist/editor/classes/galleryContent';
import {allowedFileTypes, allowedFileTypesSchema}
  from 'shared/dist/types/fileTypes';
import {DraftFrontendState} from 'shared/dist/types/draft';
import editorStyles from '../GalleryEditor.module.css';
import styles from './imageEditModalContent.module.css';
import {Button} from 'react-bootstrap';
import {useRef, useState} from 'react';
import {BaseMediaPlayer} from
  '../../../../components/BaseMediaPlayer/baseMediaPlayer';
import {editorAPI} from '../../../../api/editor';
import {useAppDispatch} from '../../../../store/store';
import {changeContent, saveDraft} from '../../../../store/editor';
import {deactivateModal} from '../../../../store/modal';


export const AddImageSetting = -1;

export const ImageEditModalContent = (props: {mediaArrayIndex: number}) => {
  const editorState = useSelector(
      (state) => (state as any).editor) as DraftFrontendState;
  const content = editorState.content as GalleryContent;
  const dispatch = useAppDispatch();
  const [isDraggedOver, toggleIsDraggedOver] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFileType, setCurrentFileType] =
   useState<allowedFileTypes | undefined>();
  const [currentMessageText, setCurrentMessageText] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const captionInput = useRef<HTMLTextAreaElement>(null);
  const [isUploading, toggleIsUploading] = useState(false);

  const addImage = async () => {
    toggleIsUploading(true);
    if (currentFile) {
      const result = await editorAPI.addResource(editorState._id, currentFile);
      if (result.success) {
        const resourceId = result.resourceId as string;
        const newContent = new GalleryContent();
        const editorContent = editorState.content as GalleryContent;
        const galleryImageArray : MediaResourceArray =
        editorContent.mediaResourceArray ?
        editorContent.mediaResourceArray : [];

        if (props.mediaArrayIndex === AddImageSetting) {
          galleryImageArray.push({
            description: captionInput.current?.value || '',
            mediaResourceURL: resourceId,
          });
        } else {
          galleryImageArray[props.mediaArrayIndex] = {
            description: captionInput.current?.value || '',
            mediaResourceURL: resourceId,
          };
        }

        newContent.initialize({
          description: editorContent.description ?
            editorContent.description : '',
          mediaResourceArray: galleryImageArray,
        });

        dispatch(changeContent(newContent));
        dispatch(saveDraft('data'));
        dispatch(deactivateModal());
      }
    }
    toggleIsUploading(false);
  };

  const onFileSelect : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0];
      const result = allowedFileTypesSchema.safeParse(file.type);
      if (result.success) {
        setCurrentFile(file);
        setCurrentMessageText(`Current file: ${file.name}`);
        setCurrentFileType(result.data);
      } else {
        setCurrentMessageText(
            `File type must be jpeg, png, gif, mp4, or mp3`);
      }
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    let file : File | null = null;
    toggleIsDraggedOver(false);
    if (event.dataTransfer.items) {
      file = event.dataTransfer.items[0].getAsFile();
    } else {
      if (event.dataTransfer.files.length > 0) {
        file = event.dataTransfer.files[0];
      }
    }

    if (file) {
      const result = allowedFileTypesSchema.safeParse(file.type);
      if (result.success) {
        setCurrentFile(file);
        setCurrentMessageText(`Current file: ${file.name}`);
        setCurrentFileType(result.data);
      } else {
        setCurrentMessageText(
            `File type must be jpeg, png, gif, mp4, or mp3`);
      }
    } else {
      setCurrentMessageText(
          `Unable to process drag and dropped file. Please try again`);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    toggleIsDraggedOver(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    toggleIsDraggedOver(false);
  };

  const removeFile = () => {
    setCurrentFile(null);
    setCurrentFileType(undefined);
    setCurrentMessageText('');
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

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
    <textarea defaultValue={caption} ref={captionInput}>
    </textarea>
    <br />
    <h3 className={editorStyles.fieldName}>Upload New Media</h3>
    <div id={styles.dragNdrop} style={isDraggedOver ? {opacity: 0.8} : {}}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}>
      {currentFile ?
      <BaseMediaPlayer type={currentFileType as allowedFileTypes}
        src={URL.createObjectURL(currentFile)} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          backgroundColor: 'black',
        }} /> : null}
      <p>Drag and drop files here or click to upload.</p>
      <input type='file'
        accept='image/jpeg,image/png,video/mp4,audio/mp3'
        onChange={onFileSelect} ref={fileInput}></input>
    </div>
    {currentMessageText ? <p>{currentMessageText}</p> : null}
    {currentFile ? <Button onClick={removeFile}
      id={styles.removeButton}>Remove</Button> : null}
    {
      props.mediaArrayIndex === AddImageSetting ? <></> : <>
        <br />
        <h3 className={editorStyles.fieldName}>Current Media File</h3>
        {imageUrl.trim() != '' ? <img src={imageUrl} alt='Gallery Media' /> :
    <>No file selected</>}
      </>
    }

    <Button onClick={addImage} style={isUploading ? {opacity: 0.8} : {}}>
      {props.mediaArrayIndex === AddImageSetting ? 'Add' : 'Edit'}
    </Button>

  </div>;
};
