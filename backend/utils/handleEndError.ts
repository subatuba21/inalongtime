import express from 'express';
import {unknownError} from 'shared/dist/types/apiErrors';
import logger from '../logger';
import {APIResponse} from './types/apiStructure';

export const handleEndError =
    (err: Error, req: express.Request, res: express.Response, next: any) => {
      const response: APIResponse = {
        data: null,
        error: unknownError,
      };

      logger.error(err);

      if (req.logout) req.logout(() => {});

      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    };
