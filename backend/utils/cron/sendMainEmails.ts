import {CronJob} from 'cron';
import logger from '../../logger';
import {getFuturesBySendDate} from '../../db/future';
import {Future} from 'shared/dist/types/future';
import {getUser} from '../../db/auth';
import {sendFutureEmail} from '../email/sendFuture';
import {Collection} from 'mongodb';

export const sendFunction = async (futureCol: Collection,
    userCol: Collection) => {
  const data = await getFuturesBySendDate(futureCol, new Date());
  logger.verbose(data);
  if (!data.success) {
    logger.error(data.error);
    return;
  }

  const futures = data.futures as Future[];
  for (const future of futures) {
    let recipientEmail = '';
    const user = await getUser(userCol, future.userId.toString());
    if (!user.success) {
      logger.error(user.error);
      continue;
    }

    const senderName = user.user?.firstname as string +
    ' ' + user.user?.lastname as string; ;
    if (future.recipientType === 'myself') {
      recipientEmail = user?.user?.email as string;
    } else {
      recipientEmail = future.recipientEmail as string;
    }

    logger.verbose(`Sending future email to ${recipientEmail}`);
    await sendFutureEmail(recipientEmail, senderName, future);
  }
};

export const sendMainEmails = (futureCol: Collection,
    userCol: Collection) => new CronJob(
    '0 0 * * *', () => sendFunction(futureCol, userCol),
    null, true, 'America/Los_Angeles');
