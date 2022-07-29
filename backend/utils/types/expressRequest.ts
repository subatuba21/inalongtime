/* eslint-disable no-unused-vars */
import {editDraftRequestBody, DraftType,
  EditDraftRequestBody,
  DraftSchema} from 'shared/dist/types/draft';
import {APIError} from 'shared/dist/types/apiErrors';
import {PaymentData} from '../schemas/payment';
import {PassportLoginInput,
  RegisterUserInput, UserSchema} from '../schemas/user';
import {Future} from 'shared/dist/types/future';

declare module 'express-serve-static-core' {
    interface Request {
      user?: UserSchema;
      error?: APIError;
      registerInfo?: RegisterUserInput;
      data?: PaymentData | any;
      draft?: {
        editDraftData?: EditDraftRequestBody,
        id?: string,
        type?: DraftType,
        dbObject?: DraftSchema,
        paid?: boolean,
      },
      future?: {
        id?: string,
        dbObject: Future
      }
      resourceId?: string
    }
}
