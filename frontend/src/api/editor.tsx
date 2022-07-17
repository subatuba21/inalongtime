import {EditDraftRequestBody,
  MiniDraft,
  UserDraftsResponseData} from 'shared/dist/types/draft';
import axios, {AxiosError} from 'axios';
import {DraftType} from 'shared/types/draft';
import {alreadyThreeDrafts} from
  'shared/dist/types/apiErrors';
import {CentralError, CentralErrors} from '../store/error';

interface getUserDraftsResult {
  success: boolean,
  error?: CentralError,
  data?: MiniDraft[],
}

export const editorAPI = {
  save: async (draftID: string, data: EditDraftRequestBody) => {
    try {
      await axios({
        method: 'put',
        url: `/api/draft/${draftID}`,
        data,
      });
    } catch (err) {

    }
  },

  new: async (type: DraftType) => {
    try {
      await axios({
        method: 'post',
        url: `/api/draft`,
        data: {
          data: {
            type,
          },
        },
      });
    } catch (err) {
      const error = err as AxiosError;
      console.log(err);
      if ((error.response as any).error?.message ===
      alreadyThreeDrafts.message) {

      } else {

      }
    }
  },

  getUserDrafts: async () : Promise<getUserDraftsResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/draft/user`,
      });

      if (res.status===200) {
        const data = res.data as {data: UserDraftsResponseData};
        return {
          success: true,
          data: data.data.drafts,
        };
      } else {
        throw new Error();
      }
    } catch (err) {
      const axerr = err as AxiosError;
      let error : CentralError;
      if ((axerr?.response as any)?.error?.message ===
      alreadyThreeDrafts.message) {
        error = {
          type: CentralErrors.addDraftError,
          message: 'You already have three drafts in your account.',
        };
      } else {
        error = {
          type: CentralErrors.addDraftError,
          message: 'There was an unknown error getting your drafts.',
        };
      }

      return {
        success: false,
        error,
      };
    }
  },
};
