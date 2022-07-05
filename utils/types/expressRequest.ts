/* eslint-disable no-unused-vars */
import {APIError} from '../../api/apiErrors';
import {PassportLoginInput,
  RegisterUserInput, UserSchema} from '../schemas/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: UserSchema;
      error?: APIError;
      registerInfo?: RegisterUserInput;
    }
}
