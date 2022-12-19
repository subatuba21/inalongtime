import express from 'express';
import {UserSchema} from '../../utils/schemas/user';
import {APIResponse} from '../../utils/types/apiStructure';
import {changePassword as changePasswordDB,
  getUserByEmail} from '../../db/auth';
import {unknownError} from 'shared/dist/types/apiErrors';
import {addToken} from '../../db/forgotPassword';
import {createToken, hashToken} from '../../utils/token';
import {sendForgotPasswordEmail as sendForgotPasswordEmailFunc}
  from '../../utils/email/forgotPasswordEmail';
import logger from '../../logger';

export const extractNewPassword =
    (req: express.Request, res: express.Response, next: Function) => {
      if (req.body.data?.password &&
        typeof req.body.data.password === 'string') {
        req.newPassword = req.body.data.password;
        next();
      } else {
        const response : APIResponse = {
          data: null,
          error: {
            code: 400,
            message: 'Must provide new password.',
          },
        };
        res.status(400).end(JSON.stringify(response));
      }
    };

export const extractEmail =
    (req: express.Request, res: express.Response, next: Function) => {
      if (req.body.data?.email &&
            typeof req.body.data.email === 'string') {
        req.email = req.body.data.email;
        next();
      } else {
        const response : APIResponse = {
          data: null,
          error: {
            code: 400,
            message: 'Must provide email.',
          },
        };
        res.status(400).end(JSON.stringify(response));
      }
    };

export const changePassword =
    async (req: express.Request, res: express.Response, next: Function) => {
      const user = req.user as UserSchema;
      const newPassword = req.newPassword as string;
      const response : APIResponse = {
        data: null,
        error: null,
      };

      try {
        await changePasswordDB(req.dbManager.getUserDB(),
            user._id, newPassword);
        res.json(response);
      } catch (err) {
        response.error = unknownError;
        res.status(response.error?.code as number).json(response);
      }
    };

export const sendForgotPasswordEmail =
    async (req: express.Request, res: express.Response, next: Function) => {
      try {
        const email = req.email as string;
        const userRes = await getUserByEmail(req.dbManager.getDraftDB(), email);
        if (userRes.success && userRes.user) {
          const token = createToken();
          await addToken(req.dbManager.getUserDB(),
              await hashToken(token), userRes.user._id);
          await sendForgotPasswordEmailFunc(email, token, userRes.user._id);
          const response : APIResponse = {
            data: null,
            error: null,
          };
          res.json(response);
        } else {
          throw new Error('');
        }
      } catch (err) {
        logger.error((err as any).message);
        const response : APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number).json(response);
      }
    };
