import express from 'express';
import {unknownError} from '../api/apiErrors';
import {APIResponse} from './types/apiStructure';

export const handleEndError =
    (err: Error, req: express.Request, res: express.Response, next: any) => {
      const response: APIResponse = {
        data: null,
        error: unknownError,
      };

      res.status(response.error?.code as number)
          .end(JSON.stringify(response));

      req.logout(() => {});
    };
