import {Future} from 'shared/dist/types/future';
import {UserSchema} from './schemas/user';

export const allowedToAccessFuture = (future: Future, options:{
    user?: UserSchema,
} | undefined) : boolean => {
  if (options && options.user) {
    if (future.userId === options.user._id &&
        (future.recipientType === 'someone else' ||
        new Date() > future.nextSendDate)) {
      return true;
    }

    if (future.recipientType === 'someone else' &&
    (future.recipientEmail === options.user.email ||
         future.backupEmail === options.user.email)) {
      return true;
    }
  }

  if (!future.viewed || (future.viewed === true &&
     future.filesAccessible === true)) {
    return true;
  }

  return false;
};
