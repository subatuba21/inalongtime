import {ObjectID} from 'bson';
import express from 'express';
import {editDraftRequestBody,
  DraftType,
  draftTypeSchema} from 'shared/dist/types/draft';
import {DraftResponseBody,
  EditDraftRequestBody,
  UserDraftsResponseData} from 'shared/dist/types/draft';
import {draftResponseBody} from 'shared/dist/types/draft';
import {addDraft, modifyDraft,
  deleteDraft as deleteDraftFromDB,
  getDraft as getDraftFromDB,
  getUserDrafts as getUserDraftsFromDB,
} from '../../db/draft';
import logger from '../../logger';
import {getContentFilename,
  getDraftContent,
  postDraftContent} from '../../utils/contentStorage/draft';
import {UserSchema} from '../../utils/schemas/user';
import {APIResponse} from '../../utils/types/apiStructure';
import {alreadyThreeDrafts, notFoundError,
  unauthorizedError, unknownError} from 'shared/dist/types/apiErrors';
import {addDraftIdToUser, deleteDraftIdFromUser} from '../../db/auth';
import {DBError} from '../../db/errors';
import {parseContent} from 'shared/dist/editor/parseContent';
import {StatusCodes} from 'http-status-codes';

export const extractEditDraftData =
    async (req: express.Request, res: express.Response, next: Function) => {
      try {
        const body = req.body.data;
        const data = await editDraftRequestBody.parseAsync(body);
        if (!req.draft) req.draft = {};
        req.draft.editDraftData = data;
        next();
      } catch (err) {
        logger.warn(err);
        const response : APIResponse = {
          error: {
            message: 'Incorrect request body structure for edit draft.',
            code: StatusCodes.BAD_REQUEST,
          },
          data: null,
        };

        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };

export const extractDraftID =
    async (req: express.Request, res: express.Response, next: Function) => {
      if (typeof req.body?.data?.id === 'string' &&
        (req.body?.data?.id as string).length > 5) {
        if (!req.draft) req.draft = {};
        req.draft.id = req.body?.data?.id;
        next();
      } else {
        const response : APIResponse = {
          error: {
            message: 'ID is not provided properly in the request body.',
            code: StatusCodes.BAD_REQUEST,
          },
          data: null,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };

export const extractDraftIDFromURL =
  async (req: express.Request, res: express.Response, next: Function) => {
    if (typeof req.params.id === 'string' && req.params.id.length > 5) {
      if (!req.draft) req.draft = {};
      req.draft.id = req.params.id;
      next();
    } else {
      const response : APIResponse = {
        error: {
          message: 'Draft ID needs to be in URL id parameter.',
          code: StatusCodes.BAD_REQUEST,
        },
        data: null,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    }
  };

export const extractDraftType =
    async (req: express.Request, res: express.Response, next: Function) => {
      if ((await draftTypeSchema
          .safeParseAsync(req.body?.data?.type)).success===true) {
        if (!req.draft) req.draft = {};
        req.draft.type = req.body?.data?.type;
        next();
      } else {
        const response : APIResponse = {
          error: {
            message: 'Must put data type in response.',
            code: StatusCodes.BAD_REQUEST,
          },
          data: null,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };

export const addNewDraft =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draftType = req.draft?.type as DraftType;
      const user = req.user as UserSchema;
      const numDrafts = user.draftIDs ? user.draftIDs.length : 0;

      if (numDrafts===undefined || numDrafts >= 3) {
        const response : APIResponse = {
          data: null,
          error: alreadyThreeDrafts,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
        return;
      }

      const draftID = new ObjectID();
      const result = await addDraft({
        userId: user._id,
        type: draftType,
        recipientType: 'myself',
        recipientEmail: '',
        title: '',
        confirmed: false,
        backupEmail1: '',
        backupEmail2: '',
        phoneNumber: '',
        sendDate: new Date(new Date().setFullYear(
            new Date().getFullYear() + 1)),
        contentCloudStoragePath: getContentFilename(
            user._id, draftID.toString()),
      }, draftID);

      const error = await addDraftIdToUser(user._id, draftID.toString());

      const draftRes : DraftResponseBody = await draftResponseBody.parseAsync({
        content: {},
        properties: result.draft,
      });

      if (result.success && !error) {
        const response : APIResponse = {
          data: draftRes,
          error: null,
        };
        res.end(JSON.stringify(response));
      } else {
        const response : APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
        return;
      }
    };

export const editDraft =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draftData = req.draft?.editDraftData as EditDraftRequestBody;
      const draftId = req.draft?.id as string;
      const draftType =
        draftData?.properties?.type || req.draft?.type as DraftType;
      const user = req.user as UserSchema;

      if (draftData.properties) {
        const draftRes = await modifyDraft(draftId, draftData.properties);
        if (draftRes.error) {
          logger.warn(draftRes.error);
          const response : APIResponse = {
            data: null,
            error: unknownError,
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
          return;
        }
      }

      if (draftData.content) {
        try {
          const content = parseContent(draftData.content, draftType);
          await postDraftContent(user._id, draftId, content);
        } catch (err) {
          logger.warn(err);
          const response : APIResponse = {
            data: null,
            error: {
              message: 'Unable to upload draft to storage.',
              code: StatusCodes.INTERNAL_SERVER_ERROR,
            },
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
          return;
        }
      }

      const response : APIResponse = {
        data: null,
        error: null,
      };
      res.end(JSON.stringify(response));
      return;
    };

export const deleteDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const draftRes = await deleteDraftFromDB(draftId);
    const user = req.user as UserSchema;
    const error = await deleteDraftIdFromUser(user._id, draftId);

    if (draftRes.error || error) {
      logger.warn(draftRes.error || error);
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else {
      const response : APIResponse = {
        data: null,
        error: null,
      };
      res.end(JSON.stringify(response));
    }
  };

export const getDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const result = await getDraftFromDB(draftId);
    const user = req.user as UserSchema;

    if (result.error === DBError.ENTITY_NOT_FOUND) {
      const response : APIResponse = {
        data: null,
        error: notFoundError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else if (result.error) {
      const response : APIResponse = {
        data: null,
        error: notFoundError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    }

    try {
      const draftContent = await getDraftContent(user._id,
          draftId, result.draft?.type as DraftType);
      const draftRes : DraftResponseBody = await draftResponseBody.parseAsync({
        content: draftContent.serialize(),
        properties: result.draft,
      });

      const response : APIResponse = {
        data: draftRes,
        error: null,
      };
      res.end(JSON.stringify(response));
    } catch (err) {
      logger.warn(err);
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    }
  };

export const authorizeDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const user = req.user as UserSchema;

    if (user.draftIDs && user.draftIDs.includes(draftId)) next();
    else {
      const response : APIResponse = {
        data: null,
        error: unauthorizedError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    }
  };

export const getUserDrafts =
  async (req: express.Request, res: express.Response, next: Function) => {
    const user = req.user as UserSchema;
    const result = await getUserDraftsFromDB(user._id);
    if (result.error) {
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
      return;
    } else {
      const draftsData = result.draftData as UserDraftsResponseData;
      const response : APIResponse = {
        data: draftsData,
        error: null,
      };
      res.end(JSON.stringify(response));
    }
  };

