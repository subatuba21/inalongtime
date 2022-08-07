import {useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {allowedFileTypesSchema,
  allowedLetterImageFileTypes, allowedLetterImageFileTypesSchema}
  from 'shared/dist/types/fileTypes';
import {editorAPI} from '../../../../api/editor';
import {BaseMediaPlayer} from
  '../../../../components/BaseMediaPlayer/baseMediaPlayer';
import styles from './UploadImageModalContent.module.css';
import {Button} from 'react-bootstrap';
import {useAppDispatch} from '../../../../store/store';
import {deactivateModal} from '../../../../store/modal';

export const UploadImageModalContent =
  (props: {insertImage: (url: string) => any}) => {
    const editorState = useSelector(
        (state) => (state as any).editor) as DraftFrontendState;
    const [isDraggedOver, toggleIsDraggedOver] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [currentFileType, setCurrentFileType] =
     useState<allowedLetterImageFileTypes | undefined>();
    const [currentMessageText, setCurrentMessageText] = useState<string>('');
    const fileInput = useRef<HTMLInputElement>(null);
    const [isUploading, toggleIsUploading] = useState(false);
    const dispatch = useAppDispatch();

    const addImage = async () => {
      if (isUploading) return;
      toggleIsUploading(true);
      if (currentFile) {
        const result = await editorAPI
            .addResource(editorState._id, currentFile);
        if (result.success) {
          const resourceId = result.resourceId as string;
          props.insertImage(
              `/api/draft/${editorState._id}/resource/${resourceId}`);
          dispatch(deactivateModal());
        } else {
          setCurrentMessageText(result.error?.message ?
            result.error.message :
            'There was an unknown error uploading your file');
          toggleIsUploading(false);
          return;
        }
      }
    };

    const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      let file : File | null = null;
      toggleIsDraggedOver(false);
      if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        if (event.dataTransfer.getData('url')) {
          const response = await fetch(event.dataTransfer.getData('url'));
          const blob = await response.blob();
          file = new File([blob], 'image.jpg', {type: blob.type});
        } else {
          file = event.dataTransfer.items[0].getAsFile();
        }
      } else if (event.dataTransfer.files.length > 0) {
        file = event.dataTransfer.files[0];
      }

      if (file) {
        const result = allowedLetterImageFileTypesSchema.safeParse(file.type);
        if (result.success) {
          setCurrentFile(file);
          setCurrentMessageText(`Current file: ${file.name}`);
          setCurrentFileType(result.data);
        } else {
          setCurrentMessageText(
              `File type must be jpeg or png`);
        }
      } else {
        setCurrentMessageText(
            `Unable to process drag and dropped file. Please try again`);
      }
    };


    const onFileSelect :
  React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0];
      const result = allowedLetterImageFileTypesSchema.safeParse(file.type);
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


    return <>
      <div id={styles.dragNdrop} style={isDraggedOver ? {opacity: 0.8} : {}}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}>
        {currentFile ?
  <BaseMediaPlayer type={currentFileType as allowedLetterImageFileTypes}
    src={URL.createObjectURL(currentFile)} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      backgroundColor: 'black',
      objectFit: 'contain',
    }} /> : null}
        <p>Drag and drop files here or click to upload.</p>
        <input type='file'
          accept={allowedFileTypesSchema._def.values.join(',')}
          onChange={onFileSelect} ref={fileInput}></input>
      </div>
      {currentMessageText ? <p>{currentMessageText}</p> : null}
      {currentFile ? <Button onClick={removeFile}
        id={styles.removeButton}>Remove</Button> : null}

      <Button onClick={addImage} style={isUploading ? {opacity: 0.8} : {}}
        id={styles.addButton}>
      Add
      </Button>
    </>;
  };
