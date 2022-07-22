export const GalleryImage = (props: {imageUrl: string, caption: string}) => {
  return <div>
    <img src={props.imageUrl}></img>
    <p>{props.caption}</p>
    <button>edit</button>
  </div>;
};
