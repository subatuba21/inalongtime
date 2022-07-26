import Button from 'react-bootstrap/Button';
import BootstrapModal from 'react-bootstrap/Modal';
import {useSelector} from 'react-redux';
import {deactivateModal, ModalState} from '../../store/modal';
import {useAppDispatch} from '../../store/store';
// import styles from './modal.module.css';

export const Modal = () => {
  const modalState = useSelector((state) => (state as any).modal) as ModalState;
  const dispatch = useAppDispatch();
  const emptyFunc = () => {};
  const onClose = async (func?: Function) => {
    if (func) await func();
    modalState.onClose ? await modalState.onClose() : null;
    dispatch(deactivateModal());
  };

  return <BootstrapModal onHide={onClose} show={modalState.activated}>
    <BootstrapModal.Header closeButton>
      <BootstrapModal.Title>{modalState.header}</BootstrapModal.Title>
    </BootstrapModal.Header>

    <BootstrapModal.Body>
      <p>{modalState.content}</p>
    </BootstrapModal.Body>

    {(modalState.dangerButton || modalState.successButton) ?
    <BootstrapModal.Footer>
      {modalState.dangerButton ?
      <Button variant="secondary"
        onClick={
          async () =>
            await onClose(
                (modalState.dangerButton as any).onClick || emptyFunc)}>
        {modalState.dangerButton?.text}
      </Button> : <></>}
      {modalState.successButton ?
      <Button variant="primary"
        onClick={
          async () => await onClose(
              (modalState.successButton as any)
                  .onClick || emptyFunc)}>
        {modalState.successButton?.text}</Button> : <></>}
    </BootstrapModal.Footer> : <></>}
  </BootstrapModal>;
};
