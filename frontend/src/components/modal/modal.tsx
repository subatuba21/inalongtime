import Button from 'react-bootstrap/Button';
import BootstrapModal from 'react-bootstrap/Modal';
import {useSelector} from 'react-redux';
import {deactivateModal, ModalState} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
import styles from './modal.module.css';

export const Modal = () => {
  const modalState = useSelector((state) => (state as any).modal) as ModalState;
  const dispatch = useAppDispatch();
  const onClose = () => {
    modalState.onClose ? modalState.onClose() : null;
    dispatch(deactivateModal);
  };

  return !modalState.activated ? <></> :
    <div style={styles} id={styles.overlay}>
      <BootstrapModal.Dialog>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>{modalState.header}</BootstrapModal.Title>
        </BootstrapModal.Header>

        <BootstrapModal.Body>
          <p>{modalState.content}</p>
        </BootstrapModal.Body>

        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary">Save changes</Button>
        </BootstrapModal.Footer>
      </BootstrapModal.Dialog>;
    </div>;
};
