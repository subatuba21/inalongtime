/* eslint-disable no-unused-vars */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {login, register} from './user';
import {createDraft, deleteDraft} from './editor';

export type CentralError = {
    type: string,
    message: string,
  };

export type ErrorState = Record<string, CentralError | null>;

const initialState : ErrorState = {

};

export enum CentralErrors {
    signupError = 'SIGN_UP_ERROR',
    loginError = 'LOGIN_ERROR',
    addDraftError = 'ADD_DRAFT_ERROR',
    getDraftError = 'GET_DRAFT_ERROR',
    getUserDraftsError = 'GET_USER_DRAFTS_ERROR',
    deleteDraftError = 'DELETE_DRAFT_ERROR',
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    addError: (es : ErrorState, action : PayloadAction<CentralError>) => {
      es[action.payload.type] = action.payload;
    },

    clearError: (es: ErrorState, action: PayloadAction<string>) => {
      es[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (_state, action) => {
      const es = {..._state};
      if (action.payload.error) {
        const error : CentralError = {
          type: CentralErrors.signupError,
          message: action.payload.error.message,
        };
        es[CentralErrors.signupError] = error;
        return es;
      } else return _state;
    });

    builder.addCase(login.fulfilled, (_state, action) => {
      const es = {..._state};
      if (!action.payload.success) {
        const error : CentralError = {
          type: CentralErrors.loginError,
          message: 'Incorrect email or password.',
        };
        es[CentralErrors.loginError] = error;
        return es;
      } else return _state;
    });

    builder.addCase(createDraft.fulfilled, (_state, action) => {
      const es = {..._state};
      if (!action.payload.success) {
        es[CentralErrors.addDraftError] = action.payload.error as CentralError;
        return es;
      } else return _state;
    });

    builder.addCase(deleteDraft.fulfilled, (_state, action) => {
      const es = {..._state};
      if (!action.payload.success) {
        es[CentralErrors.deleteDraftError] =
          action.payload.error as CentralError;
        return es;
      } else return _state;
    });
  },
});

export const {addError, clearError} = errorSlice.actions;
