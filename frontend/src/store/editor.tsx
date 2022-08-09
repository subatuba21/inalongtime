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

export const baseCustomization = {
  fontColor: '#000000',
  backgroundColor: '#ffffff',
  font: 'Open Sans',
  headerColor: '#000000',
  showDate: false,
};

const initialState : DraftFrontendState = {
  _id: '',
  userId: '',
  title: '',
  type: 'letter',
  recipientType: 'myself',
  recipientEmail: '',
  backupEmail: '',
  phoneNumber: '',
  nextSendDate: new Date(),
  progress: {
    info: 'unopened',
    content: 'unopened',
    customize: 'unopened',
    confirm: 'unopened',
  },
  customization: baseCustomization,
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
    changeBackupEmail:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          state.backupEmail = action.payload;
        },
    changePhoneNumber:
        (state: DraftFrontendState, action: PayloadAction<string>) => {
          const withoutPlusses = action.payload.replace(/\+/g, '');
          state.phoneNumber = `+${withoutPlusses}`;
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
        state.progress[action.payload] = 'finished';
      },
    changeSendDate:
      (state: DraftFrontendState, action: PayloadAction<Date>) => {
        state.nextSendDate = action.payload;
      },
    setStepUnfinished:
      (state: DraftFrontendState, action: PayloadAction<StepType>) => {
        state.progress[action.payload] = 'unfinished';
      },
    changeSenderName:
      (state: DraftFrontendState, action: PayloadAction<string>) => {
        state.senderName = action.payload;
      },
    changeShowDate:
      (state: DraftFrontendState, action: PayloadAction<boolean>) => {
        if (!state.customization) state.customization = baseCustomization;
        state.customization =
          {...state.customization, showDate: action.payload};
      },
    loadDraft:
      (state: DraftFrontendState, action: PayloadAction<DraftResponseBody>) => {
        state._id = action.payload.properties._id;
        state.phoneNumber = action.payload.properties.phoneNumber;
        state.recipientEmail = action.payload.properties.recipientEmail;
        state.recipientType = action.payload.properties.recipientType;
        state.nextSendDate = action.payload.properties.nextSendDate;
        state.title = action.payload.properties.title;
        state.type = action.payload.properties.type;
        state._id = action.payload.properties._id;
        state.userId = action.payload.properties.userId;
        state.backupEmail = action.payload.properties.backupEmail;
        state.customization = action.payload.properties.customization;
        state.senderName = action.payload.properties.senderName;

        try {
          state.content = parseContent(action.payload.content, state.type);
        } catch {
          state.content = new Content();
        }
      },

    clearDraft:
      (state: DraftFrontendState, action: PayloadAction<undefined>) => {
        state._id = '';
        state.nextSendDate = new Date();
        state.phoneNumber = '';
        state.recipientEmail = '';
        state.recipientType = 'myself';
        state.title = '';
        state.type = 'letter';
        state._id = '';
        state.userId = '';
        state.backupEmail = '';
        state.progress = {
          info: 'unopened',
          content: 'unopened',
          customize: 'unopened',
          confirm: 'unopened',
        };
      },

    setFontColor:
      (state: DraftFrontendState, action: PayloadAction<string>) => {
        if (!state.customization) state.customization = baseCustomization;
        state.customization =
        {...state.customization, fontColor: action.payload};
      },

    setFontFamily:
      (state: DraftFrontendState, action: PayloadAction<string>) => {
        if (!state.customization) state.customization = baseCustomization;
        state.customization =
          {...state.customization, font: action.payload};
      },

    setBackgroundColor:
      (state: DraftFrontendState, action: PayloadAction<string>) => {
        if (!state.customization) state.customization = baseCustomization;
        state.customization =
          {...state.customization, backgroundColor: action.payload};
      },

    setHeaderColor:
      (state: DraftFrontendState, action: PayloadAction<string>) => {
        if (!state.customization) state.customization = baseCustomization;
        state.customization =
          {...state.customization, headerColor: action.payload};
      },
  },
});

export const {changeTitle, changePhoneNumber,
  changeBackupEmail,
  changeRecipientEmail, changeContentType,
  changeRecipientType, setStepFinished,
  setStepUnfinished,
  loadDraft, changeContent,
  changeSendDate, clearDraft,
  setFontColor, setFontFamily,
  setBackgroundColor, changeSenderName,
  changeShowDate, setHeaderColor,
} =
   editorSlice.actions;
