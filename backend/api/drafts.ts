import {mustBeLoggedIn} from './middleware/login';
import fileUpload from 'express-fileupload';
import {Router} from 'express';
import {extractDraftType, extractDraftIDFromURL,
  extractEditDraftData, extractResourceId} from './middleware/extract';
import {addNewDraft} from './middleware/draft/addNewDraft';
import {authorizeDraft} from './middleware/draft/authorizeDraft';
import {editDraft} from './middleware/draft/editDraft';
import {uploadResource} from './middleware/draft/uploadResource';
import {deleteResource} from './middleware/draft/deleteResource';
import {getUserDrafts} from './middleware/draft/getUserDrafts';
import {getDraft} from './middleware/draft/getDraft';
import {deleteDraft} from './middleware/draft/deleteDraft';


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
