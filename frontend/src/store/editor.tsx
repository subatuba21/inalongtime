import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DraftFrontendState, DraftResponseBody,
  DraftType, editDraftRequestBody,
  RecipientType} from 'shared/dist/types/draft';
import {editorAPI} from '../api/editor';
import {StepType} from 'shared/dist/types/draft';
import {parseContent} from 'shared/dist/editor/parseContent';
import {Content} from 'shared/dist/editor/classes/content';
import {CentralError} from './error';
import {activateModal} from './modal';


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
    info: false,
    content: false,
    customize: false,
    confirm: false,
  },
};

export const saveDraft = createAsyncThunk('editor/save',
    async (section: 'properties' | 'data', thunkApi) => {
      const editorState = (thunkApi.getState() as any)
          .editor as DraftFrontendState;

      if (section === 'data' && editorState.content) {
        const res = await editorAPI.save(editorState._id, editorState.type, {
          content: editorState.content?.serialize(),
        });
        if (res.success) {
        } else {
          thunkApi.dispatch(activateModal({
            content: <div>Unable to save draft due to unknown error</div>,
            header: 'Error: Unable to save draft',
          }));
        }
        return res;
      } else {
        const res = await editorAPI.save(
            editorState._id, editorState.type, editDraftRequestBody.parse({
              properties: editorState,
            }));
        if (res.success) {
        } else {
          thunkApi.dispatch(activateModal({
            content: <div>Unable to save draft due to unknown error</div>,
            header: 'Error: Unable to save draft',
          }));
        }
        return res;
      }
    });

export const createDraft = createAsyncThunk('editor/create',
    async (args: {
      type: DraftType
      onSuccess: (draftId: string) => any,
      onFailure: (error: CentralError) => any,
    }, thunkApi) => {
      const res = await editorAPI.new(args.type);
      if (res.success) {
        const data = res.data as DraftResponseBody;
        thunkApi.dispatch(loadDraft(res.data as DraftResponseBody));
        args.onSuccess(data.properties._id);
      } else {
        args.onFailure(res.error as CentralError);
      }
      return res;
    });

export const deleteDraft = createAsyncThunk('editor/delete',
    async (args: {
      id: string,
      onSuccess: () => any,
      onFailure: (error: CentralError) => any,
    }, thunkApi) => {
      const res = await editorAPI.deleteDraft(args.id);
      if (res.success) {
        args.onSuccess();
      } else {
        args.onFailure(res.error as CentralError);
      }
      return res;
    });

export const getDraft = createAsyncThunk('editor/get', async (args: {
  id: string,
  onSuccess: () => any,
  onFailure: (error: CentralError) => any,
}, thunkAPI) => {
  const res = await editorAPI.getDraft(args.id as string);
  if (res.success) {
    thunkAPI.dispatch(loadDraft(res.data as DraftResponseBody));
    args.onSuccess();
  } else {
    args.onFailure(res.error as CentralError);
  }
  return res;
});


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
    changeContent:
      (state: DraftFrontendState, action: PayloadAction<Content>) => {
        state.content = action.payload;
      },
    setStepFinished:
      (state: DraftFrontendState, action: PayloadAction<StepType>) => {
        state.progress[action.payload] = true;
      },
    setStepUnfinished:
      (state: DraftFrontendState, action: PayloadAction<StepType>) => {
        state.progress[action.payload] = false;
      },
    loadDraft:
      (state: DraftFrontendState, action: PayloadAction<DraftResponseBody>) => {
        state._id = action.payload.properties._id;
        state.backupEmail1 = action.payload.properties.backupEmail1;
        state.backupEmail2 = action.payload.properties.backupEmail2;
        state.confirmed = action.payload.properties.confirmed;
        state.phoneNumber = action.payload.properties.phoneNumber;
        state.recipientEmail = action.payload.properties.recipientEmail;
        state.recipientType = action.payload.properties.recipientType;
        state.sendDate = action.payload.properties.sendDate;
        state.title = action.payload.properties.title;
        state.type = action.payload.properties.type;
        state._id = action.payload.properties._id;
        state.userId = action.payload.properties.userId;

        try {
          state.content = parseContent(action.payload.content, state.type);
        } catch {
          state.content = new Content();
        }
      },
  },
});

export const {changeTitle, changePhoneNumber,
  changeBackupEmail1, changeBackupEmail2,
  changeRecipientEmail, changeContentType,
  changeRecipientType, setStepFinished,
  setStepUnfinished,
  loadDraft, changeContent,
} =
   editorSlice.actions;
