import styles from './Sent.module.css';
import {DraftType} from 'shared/dist/types/draft';
import {InfoCircle} from 'react-bootstrap-icons';
import {useAppDispatch} from '../../store/store';
import {activateModal, deactivateModal} from '../../store/modal';
import {formatDate} from 'shared/dist/utils/formatDate';
import {useNavigate} from 'react-router-dom';

export const Sent = (props: {
    name: string,
    type: DraftType,
    dateSent: Date,
    arrivalDate: Date,
    viewed: boolean,
    recipientType: 'myself' | 'someone else',
    recipientEmail?: string,
    _id: string,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const openInfoModal = () => {
    dispatch(activateModal({
      header: 'Info',
      content: <>
        <p className={styles.infoTag}>
          <span>
            <strong>Draft Name: </strong>
            {props.name[0].toUpperCase() + props.name.substring(1)}
          </span>
        </p>
        <p className={styles.infoTag}>
          <span>
            <strong>Type </strong>
            {props.name[0].toUpperCase() + props.name.substring(1)}
          </span>
        </p>
        <p className={styles.infoTag}>
          <span>
            <strong>Recipient: </strong>
            {props.recipientType === 'myself' ? 'Myself' : props.recipientEmail}
          </span>
        </p>
        <p className={styles.infoTag}>
          <span>
            <strong>Date Sent: </strong>
            {formatDate(props.dateSent)}
          </span>
        </p>
        <p className={styles.infoTag}>
          <span>
            <strong>Future Arrival Date: </strong>
            {formatDate(props.arrivalDate)}
          </span>
        </p>
        <p className={styles.infoTag}>
          <span>
            <strong>Viewed By Recipient: </strong>
            {props.viewed ? 'Yes' : 'No'}
          </span>
        </p>
      </>,
      successButton: new Date() >= props.arrivalDate ||
      props.recipientType === 'someone else' ? {
        text: 'View',
        onClick: () => {
          navigate(`/future/${props._id}`);
          dispatch(deactivateModal());
        },
      } : undefined,
    }));
  };
  return <div id={styles.container}>
    <span className={styles.title}
      onClick={openInfoModal}>
      {props.name.trim().length > 0 ? props.name : 'No title'}
    </span>
    <span className={styles.right}>
      <span className={styles.icons} onClick={openInfoModal}>
        <InfoCircle></InfoCircle>
      </span>
      <span className={styles.type}>
        {props.type[0].toUpperCase() + props.type.substring(1)}
      </span>
    </span>

  </div>;
};
