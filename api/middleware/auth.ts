import express from 'express';
import passport from 'passport';
import {ClientUserData, loginUserInputSchema,
  UserSchema} from '../../utils/schemas/user';
import {credentialsInvalid} from '../errors';
import {APIResponse} from '../../utils/types/apiStructure';
import logger from '../../logger';
export const extractLoginInput =
    async (req: express.Request, res: express.Response, next: Function) => {
      try {
        const user = await loginUserInputSchema.parseAsync(req.body);
        req.user = user;
        next();
      } catch (err) {
        logger.warn(
            `Zod error for login attempt. Error ${err}. Input: ${req.body}`);
        const response : APIResponse = {
          data: null,
          error: credentialsInvalid,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
      }
    };

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
        logger.info(
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
          logger.info(
              `Successful login. User: ${JSON.stringify(req.user)}}`);
          const clientUserData : ClientUserData = {
            ...req.user as UserSchema,
          };

          const response : APIResponse = {
            data: clientUserData,
            error: null,
          };
          res.end(JSON.stringify(response));
        });
      }
    })(req, res, next);
  };
