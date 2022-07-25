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

interface deleteDraftResult {
  success: boolean,
  error?: CentralError
}

interface addResourceResult {
  success: boolean,
  resourceId?: string,
  error?: CentralError
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
          type: CentralErrors.getDraftError,
          message: 'Unable to find requested draft.',
        },
      };
    }
  },

  deleteDraft: async (draftID: string) : Promise<deleteDraftResult> => {
    try {
      const res = await axios({
        method: 'delete',
        url: `/api/draft/${draftID}`,
      });
      if (res.status === 200) {
        return {
          success: true,
        };
      } else throw new Error();
    } catch (err) {
      return {
        success: false,
        error: {
          type: CentralErrors.deleteDraftError,
          message: 'Unable to delete draft due to unknown error.',
        },
      };
    }
  },
  save: async (draftID: string, type: DraftType, data: EditDraftRequestBody) => {
    try {
      const res = await axios({
        method: 'put',
        url: `/api/draft/${draftID}`,
        data: {
          data: {
            ...data,
            type,
          },
        },
      });
      if (res.status === 200) {
        return {
          success: true,
        };
      } else throw new Error();
    } catch (err) {
      return {
        success: false,
        error: {
          type: CentralErrors.saveDraftError,
          message: 'Unable to save draft due to unknown error.',
        },
      };
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
            message: alreadyThreeDrafts.message,
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
      const error = {
        type: CentralErrors.getUserDraftsError,
        message: 'There was an unknown error getting your drafts.',
      };

      return {
        success: false,
        error,
      };
    }
  },

  addResource: async (draftID: string, resource: File) : Promise<addResourceResult> => {
    try {
      const res = await axios({
        method: 'post',
        url: `/api/draft/${draftID}/resource`,
        data: {
          file: resource,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        return {
          success: true,
          resourceId: res.data.data.resourceId,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      if ((error as any)?.response?.data?.error?.message) {
        return {
          success: false,
          error: {
            type: CentralErrors.addResourceError,
            message: (error as any)?.response?.data?.error?.message,
          },
        };
      }
      return {
        success: false,
        error: {
          type: CentralErrors.addResourceError,
          message: 'There was an unknown error adding a resource.',
        },
      };
    }
  },
};
