import {ObjectID} from 'bson';
import express from 'express';
import {draftFrontendState,
  DraftType,
  draftTypeSchema} from 'shared/dist/types/draft';
import {addDraft} from '../../db/draft';
import {DBError} from '../../db/errors';
import logger from '../../logger';
import {getContentFilename} from '../../utils/contentStorage/draft';
import {UserSchema} from '../../utils/schemas/user';
import {APIResponse} from '../../utils/types/apiStructure';
import {alreadyThreeDrafts, unknownError} from '../apiErrors';

export const extractDraftState =
    async (req: express.Request, res: express.Response, next: Function) => {
      try {
        const body = req.body.data;
        const state = await draftFrontendState.parseAsync(body);
        if (!req.draft) req.draft = {};
        req.draft.frontendDraftState = state;
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
      if (typeof req.body?.data?.draftID === 'string' &&
        (req.body?.data?.draftID as string).length > 5) {
        if (!req.draft) req.draft = {};
        req.draft.id = req.body?.data?.draftID;
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
      if (result.success) {
        const response : APIResponse = {
          data: result.draft,
          error: null,
        };

        res.end(JSON.stringify(response));
      } else {
        if (result.error === DBError.ALREADY_THREE_DRAFTS) {
          const response : APIResponse = {
            data: null,
            error: alreadyThreeDrafts,
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
        }
      }
    };
