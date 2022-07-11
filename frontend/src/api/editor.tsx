import {DraftFrontendState} from 'shared/types/draft';

export const editorAPI = {
  save: async (state: DraftFrontendState) : Promise<boolean> => {
    console.log('saving');
    console.log(state);
    return false;
  },
};
