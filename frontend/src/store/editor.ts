import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DraftFrontendState, DraftType} from 'shared/types/draft';
import {editorAPI} from '../api/editor';
import {RootState} from './store';


const initialState : DraftFrontendState = {
  _id: '',
  userId: '',
  title: '',
  type: 'letter',
  recipientType: 'myself',
  confirmed: false,
  backupEmail1: '',
  backupEmail2: '',
  phoneNumber: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    changeTitle: (state: DraftFrontendState, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    changeContentType:
    (state: DraftFrontendState, action: PayloadAction<DraftType>) => {
      state.type = action.payload;
      state.content = undefined;
    },
  },
});

export const save = createAsyncThunk('editor/save', async (_, thunkApi) => {
  const rootState = thunkApi.getState() as RootState;
  const success = await editorAPI.save(rootState.editor);
  if (!success) {

  }
});

export const {changeTitle} = editorSlice.actions;
