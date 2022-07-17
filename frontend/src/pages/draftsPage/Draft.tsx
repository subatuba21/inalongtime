import styles from './draft.module.css';
import {XLg, Pen} from 'react-bootstrap-icons';

export const Draft = (props: {
  name: string,
  id: string,
  type: string
}) => {
  return <div style={styles} id={styles.container}>
    <span className={styles.title}>
      {props.name.trim().length > 0 ? props.name : 'No title'}
    </span>

    <span className={styles.right}>
      <span className={styles.icons}>
        <Pen id={styles.edit}></Pen>
        <XLg id={styles.close}></XLg>
      </span>
      <span className={styles.type}>
        {props.type[0].toUpperCase() + props.type.substring(1)}
      </span>
    </span>

  </div>;
};
