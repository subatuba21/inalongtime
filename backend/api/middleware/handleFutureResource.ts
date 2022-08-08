import express from 'express';
import {Future} from 'shared/dist/types/future';
import {getFuture} from '../../db/future';
export const handleFutureResource =
    async (req: express.Request, res: express.Response, next: Function) => {
      const id = req.draft?.id as string;
      const future = await getFuture(id);
      if (future.success) {
        const futureOb = future.future as Future;
        if (futureOb.viewed === true && futureOb.filesAccesible === true) {
          req.future = {};
          req.future.id = futureOb._id;
          req.draft = {};
          req.draft.id = futureOb._id;
        }
      }
      next();
    };
