import {useSelector} from 'react-redux';
import {GalleryContent} from 'shared/dist/editor/classes/galleryContent';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {activateModal} from '../../../../store/modal';
import {useAppDispatch} from '../../../../store/store';
import {ImageEditModalContent} from
  '../imageEditModalContent/ImageEditModalContent';

export const GalleryImage = (props: {mediaArrayIndex: number}) => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;
  const dispatch = useAppDispatch();
  const content = editorState.content as GalleryContent;
  const image = (content.mediaResourceArray as {
    description: string;
    mediaResourceURL: string;
  }[]
  )[props.mediaArrayIndex];

  const onClick = () => {
    dispatch(activateModal({
      header: 'Edit Gallery Image',
      content: <ImageEditModalContent
        mediaArrayIndex={props.mediaArrayIndex} />,
    }));
  };

  return <div onClick={onClick}>
    <img src={image.mediaResourceURL}></img>
    <p>{image.description}</p>
    <button>edit</button>
  </div>;
};
