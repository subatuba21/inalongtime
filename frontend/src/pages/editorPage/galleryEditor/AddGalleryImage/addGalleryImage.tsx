import styles from '../galleryImage.module.css';
import {Plus} from 'react-bootstrap-icons';
import {useAppDispatch} from '../../../../store/store';
import {activateModal} from '../../../../store/modal';
import {AddImageSetting, ImageEditModalContent} from
  '../imageEditModalContent/ImageEditModalContent';

export const AddGalleryImage = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(activateModal({
      header: 'Add Gallery Image',
      content: <ImageEditModalContent
        mediaArrayIndex={AddImageSetting} />,
    }));
  };
  return <div className={styles.imageBox} id={styles.addImage}
    onClick={onClick}>
    <Plus></Plus>
    <p>Add Image</p>
  </div>;
};
