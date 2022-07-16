/* eslint-disable no-unused-vars */
import {editDraftRequestBody, DraftType,
  EditDraftRequestBody} from 'shared/types/draft';
import {APIError} from '../../api/apiErrors';
import {PaymentData} from '../schemas/payment';
import {PassportLoginInput,
  RegisterUserInput, UserSchema} from '../schemas/user';

declare module 'express-serve-static-core' {
    interface Request {
      user?: UserSchema;
      error?: APIError;
      registerInfo?: RegisterUserInput;
      data?: PaymentData | any;
      draft?: {
        editDraftData?: EditDraftRequestBody,
        id?: string,
        type?: DraftType
      }
    }
}
