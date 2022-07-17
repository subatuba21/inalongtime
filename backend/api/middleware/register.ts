import {ZodError} from 'zod';
import logger from '../../logger';
import {APIRegisterInput,
  ClientUserData, RegisterUserInput} from '../../utils/schemas/user';
import {APIResponse} from '../../utils/types/apiStructure';
import {alreadySignedUp,
  registerValidationError, unknownError} from 'shared/dist/types/apiErrors';
import {registerUser as registerUserToDb} from '../../db/auth';
import express from 'express';
import {DBError} from '../../db/errors';

export const extractRegisterInput =
async (req: express.Request, res: express.Response, next: Function) => {
  try {
    const body = await APIRegisterInput.parseAsync(req.body);
    req.registerInfo = body.data;
    next();
  } catch (err) {
    logger.verbose(
        `Zod error for register attempt. Error ${err}. Input: ${req.body}`);
    if (err instanceof ZodError) {
      const response : APIResponse = {
        data: null,
        error: registerValidationError,
      };

      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    } else {
      const response : APIResponse = {
        data: null,
        error: unknownError,
      };

      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    }
  }
};

export const registerUser =
  async (req: express.Request, res: express.Response, next: Function) => {
    try {
      const userInfo = req.registerInfo as RegisterUserInput;
      const user = await registerUserToDb(userInfo);
      if (user.success && user.user) {
        const userData : ClientUserData = {
          _id: user.user._id,
          email: user.user.email,
          firstname: user.user.firstname,
          lastname: user.user.lastname,
        };
        const response : APIResponse = {
          error: null,
          data: userData,
        };
        res.end(JSON.stringify(response));
      } else {
        if (user.error === DBError.UNIQUE_ENTITY_ALREADY_EXISTS) {
          const response : APIResponse = {
            error: alreadySignedUp,
            data: null,
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
        } else {
          const response : APIResponse = {
            error: unknownError,
            data: null,
          };
          res.status(response.error?.code as number)
              .end(JSON.stringify(response));
        }
      }
    } catch (err) {
      const response : APIResponse = {
        error: unknownError,
        data: null,
      };
      res.status(response.error?.code as number)
          .end(JSON.stringify(response));
    }
  };
