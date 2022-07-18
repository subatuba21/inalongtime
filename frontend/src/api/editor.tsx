/* eslint-disable max-len */
import {DraftResponseBody, EditDraftRequestBody,
  MiniDraft,
  UserDraftsResponseData} from 'shared/dist/types/draft';
import axios, {AxiosError} from 'axios';
import {draftResponseBody, DraftType} from 'shared/dist/types/draft';
import {alreadyThreeDrafts} from
  'shared/dist/types/apiErrors';
import {CentralError, CentralErrors} from '../store/error';

interface getUserDraftsResult {
  success: boolean,
  error?: CentralError,
  data?: MiniDraft[],
}

interface getDraftResult {
  success: boolean,
  error?: CentralError,
  data?: DraftResponseBody,
}

export const editorAPI = {
  getDraft: async (draftID: string) : Promise<getDraftResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/draft/${draftID}`,
      });
      const data = await draftResponseBody.parseAsync(res.data?.data);
      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          type: CentralErrors.addDraftError,
          message: 'Unable to find requested draft.',
        },
      };
    }
  },
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

  new: async (type: DraftType) : Promise<getDraftResult> => {
    try {
      const res = await axios({
        method: 'post',
        url: `/api/draft`,
        data: {
          data: {
            type,
          },
        },
      });

      const data = await draftResponseBody.parseAsync(res.data?.data);
      return {
        success: true,
        data,
      };
    } catch (err) {
      const error = err as AxiosError;
      if ((error.response as any)?.data?.error?.message ===
      alreadyThreeDrafts.message) {
        return {
          success: false,
          error: {
            type: CentralErrors.addDraftError,
            message: 'You already have three drafts in your account. Please remove one and try again.',
          },
        };
      } else {
        return {
          success: false,
          error: {
            type: CentralErrors.addDraftError,
            message: 'There was an unknown error in adding a draft.',
          },
        };
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
