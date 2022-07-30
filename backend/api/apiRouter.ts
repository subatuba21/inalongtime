import express, {Router} from 'express';
import passport from 'passport';
import {authRouter} from './auth';
import {draftRouter} from './drafts';
import {futureRouter} from './future';
import {paymentRouter} from './payment';

// eslint-disable-next-line new-cap
export const apiRouter = Router();

apiRouter.use(
    (req: express.Request, res: express.Response, next: () => any) => {
      // For webhook to have raw request body
      if (req.originalUrl === '/api/payment/success') next();
      else express.json()(req, res, next);
    });
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

apiRouter.use('/future', futureRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/draft', draftRouter);
apiRouter.use('/payment', paymentRouter);
