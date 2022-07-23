import {useSelector} from 'react-redux';
import {GalleryContent} from 'shared/dist/editor/classes/galleryContent';
import {DraftFrontendState} from 'shared/dist/types/draft';

export const AddImageSetting = -1;

export const ImageEditModalContent = (props: {mediaArrayIndex: number}) => {
  const editorState = useSelector(
      (state) => (state as any).editor) as DraftFrontendState;
  const content = editorState.content as GalleryContent;
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

  return <div>
    <span>Image Caption</span>
    <textarea value={caption}>
    </textarea>
    <span>Upload Image</span>
    <input type='file'></input>
    <img src={imageUrl} alt='Gallery Image' />
  </div>;
};
