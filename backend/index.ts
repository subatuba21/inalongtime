import {config} from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  config({
    path: './test.env',
  });
} else config();

import express from 'express';
import {getDb, setupDb} from './db/setup';
import logger from './logger';
import {setUserDb} from './db/auth';
import './utils/passport/setup';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {handleEndError} from './utils/handleEndError';
import path from 'path';
import {setDraftDb} from './db/draft';
import {setFutureDb} from './db/future';
import {apiRouter} from './api/apiRouter';


const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME,
  }),
}));

app.use('/api', apiRouter);
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// For anything that is async and needed by the server.
export const start = async (options?: {
  port?: number,
}) => {
  const PORT = options?.port ||
    parseInt(process.env.PORT as string) as number || 3000;
  await setupDb(process.env.MONGO_URL as string);
  const client = getDb();
  setUserDb(client);
  setDraftDb(client);
  setFutureDb(client);
  const server = app.listen(PORT,
      () => logger.info('Server started on port ' + PORT));
  return server;
};

app.use(handleEndError);

process.on('uncaughtException', (err) => {
  logger.error(err);
});

if (process.env.NODE_ENV!=='test') start();

