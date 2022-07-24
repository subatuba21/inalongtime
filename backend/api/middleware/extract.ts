import {StatusCodes} from 'http-status-codes';
import {editDraftRequestBody, draftTypeSchema} from 'shared/dist/types/draft';
import logger from '../../logger';
import {APIResponse} from '../../utils/types/apiStructure';
import express from 'express';

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

export const extractResourceId =
    async (req: express.Request, res: express.Response, next: Function) => {
      if (typeof req.params.resourceId === 'string' &&
       req.params.resourceId.length > 5) {
        req.resourceId = req.params.resourceId;
        next();
      } else {
        const response : APIResponse = {
          error: {
            message:
            'Resource ID is not provided properly in the request body.',
            code: StatusCodes.BAD_REQUEST,
          },
          data: null,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };
