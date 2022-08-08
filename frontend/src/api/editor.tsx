/* eslint-disable max-len */
import {DraftResponseBody, EditDraftRequestBody,
  MiniDraft,
  UserDraftsResponseData} from 'shared/dist/types/draft';
import {futureFrontendData, FutureFrontendData} from 'shared/dist/types/future';
import axios, {AxiosError} from 'axios';
import {draftResponseBody, DraftType} from 'shared/dist/types/draft';
import {FutureResponseBody, futureResponseBody} from 'shared/dist/types/future';
import {alreadyThreeDrafts} from
  'shared/dist/types/apiErrors';
import {CentralError, CentralErrors} from '../store/error';

interface getUserDraftsResult {
  success: boolean,
  error?: CentralError,
  data?: MiniDraft[],
}

interface getSentFutureResult {
  success: boolean,
  error?: CentralError,
  data?: FutureFrontendData,
}

interface getDraftResult {
  success: boolean,
  error?: CentralError,
  data?: DraftResponseBody,
}

interface getFutureResult {
  success: boolean,
  error?: CentralError,
  data?: FutureResponseBody,
}

interface deleteResult {
  success: boolean,
  error?: CentralError
}

interface addResourceResult {
  success: boolean,
  resourceId?: string,
  error?: CentralError
}

interface booleanResult {
  success: boolean,
  error?: CentralError
  result: boolean
}

interface paidResult {
  success: boolean,
  error?: CentralError
  paid: boolean
  reason: string,
}

interface getPaymentLinkResult {
  success: boolean,
  link?: string,
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

  getFuture: async (futureId: string) : Promise<getFutureResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/future/${futureId}`,
      });
      const data = await futureResponseBody.parseAsync(res.data?.data);
      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          type: CentralErrors.getDraftError,
          message: 'Unable to find requested future.',
        },
      };
    }
  },

  deleteDraft: async (draftID: string) : Promise<deleteResult> => {
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

  getSentDrafts: async () : Promise<getSentFutureResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/draft/sent`,
      });
      if (res.status===200) {
        const parsed = await futureFrontendData.safeParseAsync(res.data?.data);
        if (!parsed.success) throw new Error('Unable to retrieve sent drafts. Please try again later.');

        return {
          success: true,
          data: parsed.data,
        };
      } else {
        throw new Error();
      }
    } catch (err) {
      const error = {
        type: CentralErrors.getDraftError,
        message: 'There was an unknown error getting your sent drafts.',
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

  deleteResource: async (draftID: string, resourceId: string) : Promise<deleteResult> => {
    try {
      const res = await axios({
        method: 'delete',
        url: `/api/draft/${draftID}/resource/${resourceId}`,
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
          type: CentralErrors.deleteResourceError,
          message: 'Unable to delete resource due to unknown error.',
        },
      };
    }
  },

  checkDraftIsPaid: async (draftID: string) : Promise<paidResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/draft/${draftID}/paid`,
      });
      if (res.status === 200) {
        return {
          success: true,
          paid: res.data.data.paidInfo.paid,
          reason: res.data.data.paidInfo.reason,
        };
      } else throw new Error();
    } catch (err) {
      return {
        success: false,
        paid: false,
        reason: '',
        error: {
          type: CentralErrors.getDraftError,
          message: 'Unable to check if draft is paid due to unknown error.',
        },
      };
    }
  },

  getPaymentLink: async (draftID: string) : Promise<getPaymentLinkResult> => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/payment/link/${draftID}`,
      });
      if (res.status === 200) {
        return {
          success: true,
          link: res.data.data.paymentLink,
        };
      } else throw new Error();
    } catch (err: any) {
      let errMessage = 'Unable to get payment link due to unknown error.';
      if (typeof err.response?.data?.error?.message === 'string') {
        errMessage = err.response.data.error.message;
      }

      return {
        success: false,
        error: {
          type: CentralErrors.getDraftError,
          message: errMessage,
        },
      };
    }
  },

  confirmUnpaidDraft: async (draftID: string) : Promise<booleanResult> => {
    try {
      const res = await axios({
        method: 'put',
        url: `/api/draft/${draftID}/complete-unpaid`,
      });
      if (res.status === 200) {
        return {
          success: true,
          result: true,
        };
      } else throw new Error();
    } catch (err) {
      return {
        success: false,
        error: {
          type: CentralErrors.getDraftError,
          message: 'Unable to confirm draft due to unknown error.',
        },
        result: false,
      };
    }
  },
};
