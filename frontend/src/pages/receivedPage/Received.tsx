import {useNavigate} from 'react-router-dom';
import {DraftType} from 'shared/dist/types/draft';
import {formatDate} from 'shared/dist/utils/formatDate';
import styles from './ReceivedPage.module.css';
export const Received = (props: {
    name: string,
    type: DraftType,
    arrivalDate: Date,
    _id: string,
    senderName: string
}) => {
  const navigate = useNavigate();
  return <div className={styles.received} onClick={() => {
    navigate(`/future/${props._id}`);
  }}>
    <div>
      <h3>{props.name}</h3>
      <h4>
        <span style={{
          color: 'rgba(0, 0, 0, 0.6)',
        }}>{props.type[0].toUpperCase() +
    props.type.substring(1)}</span> from {props.senderName}</h4>
    </div>
    <div className={styles.dateDiv}>Arrived&nbsp;
      {formatDate(props.arrivalDate)}</div>
  </div>;
};
