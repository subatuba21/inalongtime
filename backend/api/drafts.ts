import {mustBeLoggedIn} from './middleware/login';
import fileUpload from 'express-fileupload';
import {Router} from 'express';
import {extractDraftType, extractDraftIDFromURL,
  extractEditDraftData, extractResourceId} from './middleware/extract';
import {addNewDraft} from './middleware/draft/addNewDraft';
import {authorizeDraft} from './middleware/draft/authorizeDraft';
import {editDraft} from './middleware/draft/editDraft';
import {uploadResource, allowFileTypes}
  from './middleware/draft/uploadResource';
import {deleteResource} from './middleware/draft/deleteResource';
import {getUserDrafts} from './middleware/draft/getUserDrafts';
import {getDraft, populateDraftFromDB} from './middleware/draft/getDraft';
import {deleteDraft} from './middleware/draft/deleteDraft';
import {getResource} from './middleware/draft/getResource';
import {convertDraftToFuture, deleteUnnecessaryFiles, onlyAllowUnpaid,
  setIsDraftIsPaid} from './middleware/fulfillment';
import {returnIsDraftPaid} from './middleware/draft/isDraftPaid';
import {getSentFutures} from './middleware/draft/getSentFutures';
import {handleFutureResource} from './middleware/handleFutureResource';
import {allowedToAccessFuture} from '../utils/allowedFutureAccess';
import {Future} from 'shared/types/future';
import {UserSchema} from '../utils/schemas/user';


// eslint-disable-next-line new-cap
export const draftRouter = Router();

draftRouter.get('/user', mustBeLoggedIn, getUserDrafts);
draftRouter.get('/sent', mustBeLoggedIn, getSentFutures);
draftRouter.post('/', mustBeLoggedIn, extractDraftType, addNewDraft);
draftRouter.put('/:id', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, extractDraftType,
    extractEditDraftData, editDraft);
draftRouter.get('/:id', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, getDraft);
draftRouter.delete('/:id', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, deleteDraft);
draftRouter.post('/:id/resource', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft,
    fileUpload({
      useTempFiles: true,
    }), allowFileTypes,
    populateDraftFromDB, deleteUnnecessaryFiles, uploadResource);
draftRouter.get('/:id/resource/:resourceId',
    extractDraftIDFromURL, extractResourceId,
    handleFutureResource, (req, res, next) => {
      if (req.future?.id &&
        allowedToAccessFuture(req.future.dbObject as Future, {
          user: req.user ? req.user as UserSchema : undefined,
        })) {
        extractResourceId(req, res, next);
        getResource(req, res, next);
      } else {
        next();
      }
    }, mustBeLoggedIn, authorizeDraft, getResource);
draftRouter.head('/:id/resource/:resourceId', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft,
    extractResourceId, getResource);
draftRouter.delete('/:id/resource/:resourceId', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft,
    extractResourceId, deleteResource);
draftRouter.get('/:id/paid', mustBeLoggedIn,
    extractDraftIDFromURL, authorizeDraft, populateDraftFromDB,
    setIsDraftIsPaid, returnIsDraftPaid);
draftRouter.put('/:id/complete-unpaid', mustBeLoggedIn, extractDraftIDFromURL,
    authorizeDraft, populateDraftFromDB,
    deleteUnnecessaryFiles, setIsDraftIsPaid,
    onlyAllowUnpaid,
    convertDraftToFuture);
