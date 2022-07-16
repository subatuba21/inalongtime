import {Router} from 'express';
import {extractDraftType,
  addNewDraft, extractEditDraftData, editDraft,
  deleteDraft,
  extractDraftIDFromURL,
  getDraft} from './middleware/draft';
import {mustBeLoggedIn} from './middleware/login';

// eslint-disable-next-line new-cap
export const draftRouter = Router();

draftRouter.post('/', mustBeLoggedIn, extractDraftType, addNewDraft);
draftRouter.put('/:id', extractDraftIDFromURL, extractDraftType,
    extractEditDraftData, editDraft);
draftRouter.get('/:id', extractDraftIDFromURL, getDraft);
draftRouter.delete('/:id', extractDraftIDFromURL, deleteDraft);
