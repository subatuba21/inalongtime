import express, {Router} from 'express';
import passport from 'passport';
import {authRouter} from './auth';
import {draftRouter} from './drafts';
import {futureRouter} from './future';

// eslint-disable-next-line new-cap
export const apiRouter = Router();

apiRouter.use(express.json());
apiRouter.use(passport.initialize());
apiRouter.use(passport.session());

apiRouter.use('/future', futureRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/draft', draftRouter);
