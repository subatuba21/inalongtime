import passport from 'passport';
import {getUser} from '../../db/auth';
import logger from '../../logger';
import {googleStrategy} from './googleStrategy';
import {localStrategy} from './localStrategy';
import express from 'express';

passport.use(localStrategy);
passport.use(googleStrategy);

passport.serializeUser((user: any, done) => {
  logger.verbose('Serializing user');
  done(null, user._id);
});

passport.deserializeUser(async (req: express.Request,
    id: string, done: any) => {
  logger.verbose('Deserializing user');
  const userResponse = await getUser(req.dbManager.getDraftDB(), id);
  if (userResponse.success && userResponse.user) {
    return done(null, userResponse.user);
  } else if (!userResponse.success && userResponse.error) {
    logger.verbose('Deserializing user error field.');
    return done(new Error(userResponse.error), null);
  } else {
    return done(new Error(
        `Unable to deserialize user with ID: ${id}. No error specified.`));
  }
});

export const manuallySerializeUser = (req: express.Request, userId: string) => {
  logger.verbose('Manually serializing user');
  if (!(req.session as any).passport) (req.session as any).passport = {};
  (req.session as any).passport.user = userId;
};
