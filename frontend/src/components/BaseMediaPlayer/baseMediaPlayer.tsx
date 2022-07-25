import {CSSProperties} from 'react';
import {allowedFileTypes} from 'shared/dist/types/fileTypes';

export const BaseMediaPlayer = (props: {
    type: allowedFileTypes,
    src: string,
    style: CSSProperties | undefined
}) => {
  if (props.type.startsWith('image')) {
    return <img src={props.src} style={props.style}></img>;
  } else if (props.type.startsWith('video')) {
    return <video src={props.src} style={props.style} controls={true}></video>;
  } else if (props.type.startsWith('audio')) {
    return <audio src={props.src} style={props.style} controls={true}></audio>;
  } else return <></>;
};
