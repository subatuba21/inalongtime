import express from 'express';
import passport from 'passport';
import {ClientUserData,
  UserSchema} from '../../utils/schemas/user';
import {credentialsInvalid, needToLogin} from '../apiErrors';
import {APIResponse} from '../../utils/types/apiStructure';
import logger from '../../logger';

// Passport reads directly from req.body.username/email and req.body.password
// Defies request convention out of necessity.
export const passportAuthenticateLocal =
  async (req: express.Request, res: express.Response, next: Function) => {
    passport.authenticate('local', (err, user) => {
      req.user = user;
      if (err) {
        logger.warn(
            `Login error: ${err} \ input : ${JSON.stringify(req.user)}`);

        const response: APIResponse = {
          data: null,
          error: credentialsInvalid,
        };

        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      } else if (!req.user) {
        logger.verbose(
            `Incorrect login. Input: ${JSON.stringify(req.user)}}`);
        const response: APIResponse = {
          data: null,
          error: credentialsInvalid,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      } else {
        req.user = req.user as UserSchema;
        req.login(req.user, (err) => {
          if (err) {
            logger.warn(`Error logging in: ${err}`);
            const response: APIResponse = {
              data: null,
              error: credentialsInvalid,
            };
            res.status(response.error?.code as number)
                .end(JSON.stringify(response));
          } else {
            logger.verbose(
                `Successful login. User: ${JSON.stringify(req.user)}}`);
            const clientUserData : ClientUserData = {
              ...req.user as UserSchema,
            };

            const response : APIResponse = {
              data: clientUserData,
              error: null,
            };
            res.end(JSON.stringify(response));
          }
        });
      }
    })(req, res, next);
  };

export const mustBeLoggedIn =
  async (req: express.Request, res: express.Response, next: Function) => {
    if (req.user) next();
    else {
      const response: APIResponse = {
        data: null,
        error: needToLogin,
      };
      res.status(response.error?.code as number).end(response);
    }
  };
