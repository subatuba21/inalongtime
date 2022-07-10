import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LetterContent} from 'shared/dist/editor/classes/letterContent';
import {DraftType} from 'shared/types/draft';
import {RootState} from './store';


export type DraftEditorState = {
    name: String,
    contentType: DraftType,
    recipientType: String,
    recipientEmail?: String,
    backupEmail1: String,
    backupEmail2: String,
    phoneNumber: String,
    content?: LetterContent
}

const initialState : DraftEditorState = {
  name: '',
  contentType: 'letter',
  recipientType: '',
  recipientEmail: '',
  backupEmail1: '',
  backupEmail2: '',
  phoneNumber: '',
  content: undefined,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    changeName: (state: DraftEditorState, action: PayloadAction<String>) => {
      state.name = action.payload;
    },
    changeContentType:
    (state: DraftEditorState, action: PayloadAction<DraftType>) => {
      state.contentType = action.payload;
      state.content = undefined;
    },
  },
});

export const save = createAsyncThunk('editor/save', async (_, thunkApi) => {
  const rootState = thunkApi.getState() as RootState;
  rootState.editor;
});

export const {changeName} = editorSlice.actions;
