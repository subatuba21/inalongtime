import styles from './selectBox.module.css';

export const SelectBox = (props: {
     options: string[],
     values: string[],
     name: string,
     valueState: {value: string, set: Function},
     onChange?: React.ChangeEventHandler<HTMLSelectElement>,
}) => {
  const onChange : React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    props.valueState.set(event.currentTarget.value);
  };

  return <div style={styles}>
    <select onInput={onChange}
      onChange={props.onChange ? props.onChange : () => null}>
      {props.options.map((str, index) => {
        const selected =
          props.valueState.value===props.values[index] ? true : false;
        return <option key={str} value={props.values[index]}
          selected={selected}>{str}</option>;
      })}
    </select>
  </div>;
};
