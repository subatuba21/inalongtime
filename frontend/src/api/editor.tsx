import {EditDraftRequestBody} from 'shared/dist/types/draft';
import axios, {AxiosError} from 'axios';
import {DraftType} from 'shared/types/draft';
import {alreadyThreeDrafts} from
  'shared/dist/types/apiErrors';

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
};
