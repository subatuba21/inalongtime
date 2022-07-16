import {Router} from 'express';
import {extractDraftType,
  addNewDraft, extractEditDraftData,
  extractDraftID, editDraft} from './middleware/draft';
import {mustBeLoggedIn} from './middleware/login';

// eslint-disable-next-line new-cap
export const draftRouter = Router();

draftRouter.post('/', mustBeLoggedIn, extractDraftType, addNewDraft);
draftRouter.put('/', extractDraftID, extractDraftType,
    extractEditDraftData, editDraft);
// draftRouter.get('/', extractDraftID, getDraft);
// draftRouter.delete('/', extractDraftID, deleteDraft);
