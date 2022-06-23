/* eslint-disable no-unused-vars */
import {APIError} from '../../api/errors';
import {LoginInput, UserSchema} from '../schemas/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: LoginInput | UserSchema;
      error?: APIError;
    }
}
