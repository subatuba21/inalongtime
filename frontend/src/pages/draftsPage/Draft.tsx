import styles from './draft.module.css';
import {XLg, Pen} from 'react-bootstrap-icons';

export const Draft = () => {
  return <div style={styles} id={styles.container}>
    <span className={styles.title}>A message from 2020</span>

    <span className={styles.right}>
      <span className={styles.icons}>
        <Pen id={styles.edit}></Pen>
        <XLg id={styles.close}></XLg>
      </span>
      <span className={styles.type}>Letter</span>
    </span>

  </div>;
};
