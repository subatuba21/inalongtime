import {config} from 'dotenv';
config();

import logger from './logger';
import './utils/passport/setup';
import {sendFunction, sendMainEmails} from './utils/cron/sendMainEmails';
import {getSetup} from './setEnvironment';
import {DBManager} from './utils/types/dbManager';
import Express from 'express';

const setupPromise = getSetup();

// For anything that is async and needed by the server.
export const start = async (app: Express.Application,
    dbManager: DBManager,
    options?: {
  port?: number,
}) => {
  const PORT = options?.port ||
    parseInt(process.env.PORT as string) as number || 3000;
  const server = app.listen(PORT,
      () => logger.info('Server started on port ' + PORT));
  sendMainEmails(dbManager.getFutureDB(), dbManager.getUserDB()).start();
  sendFunction(dbManager.getFutureDB(), dbManager.getUserDB());
  return server;
};

process.on('uncaughtException', (err) => {
  logger.error(err);
});

setupPromise.then(({
  server,
  dbManager,
}) => start(server, dbManager));

