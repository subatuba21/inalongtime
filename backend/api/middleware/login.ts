import express from 'express';
import passport from 'passport';
import {ClientUserData,
  UserSchema} from '../../utils/schemas/user';
import {credentialsInvalid, needToLogin} from 'shared/dist/types/apiErrors';
import {APIResponse} from '../../utils/types/apiStructure';
import logger from '../../logger';
import {StatusCodes} from 'http-status-codes';
import {deleteToken, getToken} from '../../db/forgotPassword';
import {validateToken} from '../../utils/token';
import {manuallySerializeUser} from '../../utils/passport/setup';

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
            const user = req.user as UserSchema;

            const clientUserData : ClientUserData = {
              email: user.email,
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              method: user.method,
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
      res.status(response.error?.code as number).end(JSON.stringify(response));
    }
  };

export const returnCurrentUser =
  async (req: express.Request, res: express.Response, next: Function) => {
    if (req.user) {
      const user = req.user as UserSchema;

      const clientUserData : ClientUserData = {
        email: user.email,
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        method: user.method,
      };

      const response : APIResponse = {
        data: clientUserData,
        error: null,
      };

      res.end(JSON.stringify(response));
      return;
    } else {
      const response : APIResponse = {
        data: null,
        error: null,
      };

      res.end(JSON.stringify(response));
    }
  };

export const logoutMiddleware =
  async (req: express.Request, res: express.Response, next: Function) => {
    req.logout({}, () => null);
    res.end();
  };

export const getUserIDandTokenFromQuery =
  async (req: express.Request, res: express.Response, next: Function) => {
    const userId = req.query.id;
    const token = req.query.token;
    if (userId && token &&
      typeof userId === 'string' && typeof token === 'string') {
      req.userId = userId;
      req.token = token;
      next();
    } else {
      const response : APIResponse = {
        data: null,
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: 'Invalid query parameters',
        },
      };
      res.status(response.error?.code as number).end(JSON.stringify(response));
    }
  };

export const loginWithToken =
  async (req: express.Request, res: express.Response, next: Function) => {
    const userId = req.userId as string;
    const token = req.token as string;

    const dbToken = await getToken(userId);
    if (dbToken && await validateToken(token, dbToken.token)) {
      manuallySerializeUser(req, userId);
      res.redirect('/account');
      await deleteToken(userId);
      return;
    } else {
      res.redirect('/login');
    }
  };
