import {CSSProperties} from 'react';
import {allowedFileTypes} from 'shared/dist/types/fileTypes';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export const BaseMediaPlayer = (props: {
    type: allowedFileTypes,
    src: string,
    style: CSSProperties | undefined,
    plyr?: boolean,
}) => {
  if (props.type.startsWith('image')) {
    return <img src={props.src} style={props.style}></img>;
  } else if (props.type.startsWith('video')) {
    if (props.plyr) {
      return <Plyr source={{
        type: 'video',
        sources: [{
          src: props.src,
        }],
      }}></Plyr>;
    }
    return <video src={props.src} style={props.style} controls={true}></video>;
  } else if (props.type.startsWith('audio')) {
    if (props.plyr) {
      return <Plyr source={{
        type: 'audio',
        sources: [{
          src: props.src,
        }],
      }}></Plyr>;
    }
    return <audio src={props.src} style={props.style} controls={true}></audio>;
  } else return <></>;
};
