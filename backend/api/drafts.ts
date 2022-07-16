import {Router} from 'express';
import {extractDraftType,
  addNewDraft} from './middleware/draft';
import {mustBeLoggedIn} from './middleware/login';

// eslint-disable-next-line new-cap
export const draftRouter = Router();

draftRouter.post('/', mustBeLoggedIn, extractDraftType, addNewDraft);
// draftRouter.put('/', extractDraftState, editDraft);
// draftRouter.get('/', extractDraftID, getDraft);
// draftRouter.delete('/', extractDraftID, deleteDraft);
