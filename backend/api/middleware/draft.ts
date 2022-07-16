import {ObjectID} from 'bson';
import express from 'express';
import {Content} from 'shared/dist/editor/classes/content';
import {editDraftRequestBody,
  DraftType,
  draftTypeSchema} from 'shared/dist/types/draft';
import {LetterContent} from 'shared/dist/editor/classes/letterContent';
import {EditDraftRequestBody} from 'shared/types/draft';
import {addDraft, modifyDraft,
  deleteDraft as deleteDraftFromDB} from '../../db/draft';
import logger from '../../logger';
import {getContentFilename,
  postDraftContent} from '../../utils/contentStorage/draft';
import {UserSchema} from '../../utils/schemas/user';
import {APIResponse} from '../../utils/types/apiStructure';
import {alreadyThreeDrafts, unknownError} from '../apiErrors';
import {addDraftIdToUser, deleteDraftIdFromUser} from '../../db/auth';

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
          error: unknownError,
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
          error: unknownError,
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
        error: unknownError,
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
          error: unknownError,
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

      if (result.success && !error) {
        const response : APIResponse = {
          data: result.draft,
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
        draftData?.dbModifiers?.type || req.draft?.type as DraftType;

      const user = req.user as UserSchema;

      if (draftData.dbModifiers) {
        await modifyDraft(draftId, draftData.dbModifiers);
      }

      if (draftData.content) {
        let content : Content;

        switch (draftType) {
          case 'letter': {
            content = new LetterContent;
            content.deserialize(draftData.content);
          }

          default: {
            content = new Content();
          }
        }

        await postDraftContent(user._id, draftId, content);
      }
    };

export const deleteDraft =
  async (req: express.Request, res: express.Response, next: Function) => {
    const draftId = req.draft?.id as string;
    const draftRes = await deleteDraftFromDB(draftId);
    const user = req.user as UserSchema;
    const error = await deleteDraftIdFromUser(user._id, draftId);

    if (draftRes.error || error) {
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
