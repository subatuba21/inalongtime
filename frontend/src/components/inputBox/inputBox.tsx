import styles from './inputBox.module.css';

export const InputBox = (props: {placeholder: string}) => {
  return <div style={styles}>
    <input className='inputBox' placeholder={props.placeholder}></input>
  </div>;
};
