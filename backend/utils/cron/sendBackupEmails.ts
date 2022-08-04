import logger from '../../logger';
import {getFuturesWeekOldNotVisited} from '../../db/future';
import {Future} from 'shared/dist/types/future';
import {getUser} from '../../db/auth';
import {sendBackupEmail} from '../email/backupEmail';
import {sendNotViewedEmail} from '../email/notViewedEmail';

export const sendFunction = async () => {
  const data = await getFuturesWeekOldNotVisited();
  logger.verbose(data);
  if (!data.success) {
    logger.error(data.error);
    return;
  }

  const futures = data.futures as Future[];

  for (const future of futures) {
    const user = await getUser(future.userId.toString());
    if (!user.success) {
      logger.error(user.error);
      continue;
    }

    const senderName = user.user?.firstname as string +
    ' ' + user.user?.lastname as string; ;

    if (future.recipientType === 'someone else') {
      await sendNotViewedEmail(user.user?.email as string, future);
    }

    const recipientEmail = future.backupEmail;
    logger.verbose(`Sending backup email to ${recipientEmail}`);
    await sendBackupEmail(recipientEmail, senderName, future);
  }
};
