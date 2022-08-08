import styles from './sent.module.css';
import {DraftType} from 'shared/dist/types/draft';

export const Sent = (props: {
    name: string,
    type: DraftType,
}) => {
  return <div id={styles.container}>
    <span className={styles.title}
      onClick={() => {}}>
      {props.name.trim().length > 0 ? props.name : 'No title'}
    </span>
    <span className={styles.right}>
      <span className={styles.icons}>
      </span>
      <span className={styles.type}>
        {props.type[0].toUpperCase() + props.type.substring(1)}
      </span>
    </span>

  </div>;
};
