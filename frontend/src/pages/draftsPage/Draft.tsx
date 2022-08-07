/* eslint-disable max-len */
import styles from './draft.module.css';
import {Pencil, XCircleFill} from 'react-bootstrap-icons';
import {useAppDispatch} from '../../store/store';
import {activateModal} from '../../store/modal';
import {deleteDraft} from '../../store/editor';
import {useNavigate} from 'react-router-dom';

export const Draft = (props: {
  name: string,
  id: string,
  type: string,
  setLoading: (loading: boolean) => any,
}) => {
  const processedName = props.name.trim().length > 0 ? props.name : 'No title';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return <div style={styles} id={styles.container}>
    <span className={styles.title} onClick={() => navigate(`/draft/${props.id}`)}>
      {props.name.trim().length > 0 ? props.name : 'No title'}
    </span>

    <span className={styles.right}>
      <span className={styles.icons}>
        <Pencil id={styles.edit} onClick={() => navigate(`/draft/${props.id}`)}></Pencil>
        <XCircleFill id={styles.close} onClick={() => dispatch(activateModal({
          header: 'Confirm',
          content: <>{`Are you sure you want to delete the draft titled '${processedName}'? You can't go back.`}</>,
          successButton: {
            text: 'Delete',
            onClick: () => {
              dispatch(deleteDraft({
                id: props.id,
                onSuccess: () => {
                  props.setLoading(true);
                },
                onFailure: () => {
                  dispatch(activateModal({
                    header: 'Error: Unable to delete draft',
                    content: <>There was an unknown error while attempting to delete the draft. Please try again later.</>,
                  }));
                },
              }));
            },
          },
        }))}></XCircleFill>
      </span>
      <span className={styles.type}>
        {props.type[0].toUpperCase() + props.type.substring(1)}
      </span>
    </span>

  </div>;
};
