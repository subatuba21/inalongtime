import {Router} from 'express';

// eslint-disable-next-line new-cap
export const futureRouter = Router();

futureRouter.get('/', (req, res) => {
  res.send('Hello world');
});
