import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DraftFrontendState, DraftType, RecipientType} from 'shared/types/draft';
import {editorAPI} from '../api/editor';
import {RootState} from './store';


const initialState : DraftFrontendState = {
  _id: '',
  userId: '',
  title: '',
  type: 'letter',
  recipientType: 'myself',
  recipientEmail: '',
  confirmed: false,
  backupEmail1: '',
  backupEmail2: '',
  phoneNumber: '',
  sendDate: new Date(),
  progress: {
    info: true,
    content: false,
    customize: false,
    confirm: false,
  },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    changeTitle: (state: DraftFrontendState, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    changeBackupEmail1:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          state.backupEmail1 = action.payload;
        },
    changeBackupEmail2:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          state.backupEmail2 = action.payload;
        },
    changePhoneNumber:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          state.phoneNumber = action.payload;
        },
    changeContentType:
    (state: DraftFrontendState, action: PayloadAction<DraftType>) => {
      state.type = action.payload;
      state.content = undefined;
    },
    changeRecipientEmail:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          state.recipientEmail = action.payload;
        },
    changeRecipientType:
        (state: DraftFrontendState, action: PayloadAction<RecipientType>) => {
          state.recipientType = action.payload;
          if (action.payload === 'myself') state.recipientEmail = '';
        },
  },
});

export const save = createAsyncThunk('editor/save', async (_, thunkApi) => {
  const rootState = thunkApi.getState() as RootState;
  const success = await editorAPI.save(rootState.editor);
  if (!success) {

  }
});

export const {changeTitle, changePhoneNumber,
  changeBackupEmail1, changeBackupEmail2,
  changeRecipientEmail, changeContentType,
  changeRecipientType,
} =
   editorSlice.actions;
