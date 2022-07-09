import styles from './selectBox.module.css';

export const SelectBox = (props: {
     options: string[],
     name: string,
     valueState: {value: string, set: Function},
}) => {
  const onChange : React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    props.valueState.set(event.currentTarget.value);
  };

  return <div style={styles}>
    <select onInput={onChange}>
      {
        props.options.map((str) =>
          <option key={str} value={str}>{str}</option>)
      }
    </select>
  </div>;
};
