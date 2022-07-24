import {Router} from 'express';
import {extractDraftType,
  addNewDraft, extractEditDraftData, editDraft,
  deleteDraft,
  extractDraftIDFromURL,
  getDraft, authorizeDraft, getUserDrafts,
  uploadResource,
  extractResourceId,
  deleteResource} from './middleware/draft';
import {mustBeLoggedIn} from './middleware/login';
import fileUpload from 'express-fileupload';

// eslint-disable-next-line new-cap
export const draftRouter = Router();

draftRouter.get('/user', mustBeLoggedIn, getUserDrafts);
draftRouter.post('/', mustBeLoggedIn, extractDraftType, addNewDraft);
draftRouter.put('/:id',
    extractDraftIDFromURL, authorizeDraft, extractDraftType,
    extractEditDraftData, editDraft);
draftRouter.get('/:id', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, getDraft);
draftRouter.delete('/:id', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, deleteDraft);
draftRouter.post('/:id/resource', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, fileUpload(), uploadResource);
draftRouter.delete('/:id/resource/:resourceId', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft,
    extractResourceId, deleteResource);
