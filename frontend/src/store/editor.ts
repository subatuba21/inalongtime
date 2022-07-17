import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DraftFrontendState, DraftType, RecipientType} from 'shared/types/draft';
import {editorAPI} from '../api/editor';
import {StepType} from 'shared/types/draft';
import {EditDraftRequestBody} from 'shared/dist/types/draft';


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
    setStepFinished:
      (state: DraftFrontendState, action: PayloadAction<StepType>) => {
        state.progress[action.payload] = true;
      },
    setStepUnfinished:
      (state: DraftFrontendState, action: PayloadAction<StepType>) => {
        state.progress[action.payload] = false;
      },
  },
});

export const saveDraft = createAsyncThunk('editor/save',
    async (args : {id: string, data: EditDraftRequestBody}, thunkApi) => {
      await editorAPI.save(args.id, args.data);
    });

export const createDraft = createAsyncThunk('editor/create',
    async (type: DraftType, thunkApi) => {
      await editorAPI.new(type);
    });

export const {changeTitle, changePhoneNumber,
  changeBackupEmail1, changeBackupEmail2,
  changeRecipientEmail, changeContentType,
  changeRecipientType, setStepFinished,
  setStepUnfinished,
} =
   editorSlice.actions;
