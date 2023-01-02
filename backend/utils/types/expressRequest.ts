import {DraftType,
  EditDraftRequestBody,
  DraftSchema} from 'shared/dist/types/draft';
import {APIError} from 'shared/dist/types/apiErrors';
import {PaymentData} from '../schemas/payment';
import {RegisterUserInput, UserSchema} from '../schemas/user';
import {Future} from 'shared/dist/types/future';
import {Storage} from '@google-cloud/storage';
import {DBManager} from './dbManager';

declare module 'express-serve-static-core' {
    // eslint-disable-next-line no-unused-vars
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
        paidInfo?: {
          paid: boolean;
          reason: string;
        },
      },
      future?: {
        id?: string,
        dbObject?: Future
      }
      resourceId?: string,
      newPassword?: string,
      email?: string,
      userId?: string,
      token?: string,
      dbManager: DBManager,
      storage: Storage
    }
}
