import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ModalState {
    header: string,
    content: JSX.Element,
    dangerButton?: {
        text: string,
        onClick: Function,
    },
    successButton?: {
        text: string,
        onClick: Function,
    },
    onClose?: Function,
    activated: boolean,
}

const initialState : ModalState = {
  content: <></>,
  activated: false,
  header: '',
};

export interface ModalInput {
    header: string,
    content: JSX.Element,
    dangerButton?: {
        text: string,
        onClick: Function,
    },
    successButton?: {
        text: string,
        onClick: Function,
    },
    onClose?: Function,
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    activateModal: (state, action: PayloadAction<ModalInput>) => {
      state.content = action.payload.content;
      state.dangerButton = action.payload.dangerButton;
      state.header = action.payload.header;
      state.onClose = action.payload.onClose;
      state.activated = true;
    },
    deactivateModal: (state, action) => {
      state.activated = false;
    },
  },
});

export const {activateModal, deactivateModal} = modalSlice.actions;
