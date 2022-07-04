/* eslint-disable no-unused-vars */
import {APIError} from '../../api/errors';
import {PassportLoginInput, UserSchema} from '../schemas/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: PassportLoginInput | UserSchema;
      error?: APIError;
    }
}
