import express from 'express';
import {authRouter} from './api/auth';
import {futureRouter} from './api/future';
import {getDb, setupDb} from './db/setup';
import logger from './logger';
import {config} from 'dotenv';
import {setUserDb} from './db/auth';
import {authenticate} from 'passport';

const app = express();
config();

app.use(authenticate('session'));

app.use('/api/future', futureRouter);
app.use('/api/auth', authRouter);
app.use('/public', express.static('public'));
app.use('/', express.static('frontend/build'));

// For anything that is async and needed by the server.
const start = async () => {
  await setupDb(process.env.MONGO_URL as string);
  const client = getDb();
  setUserDb(client);
  app.listen(3000, () => logger.info('Server started on port 3000'));
};

process.on('uncaughtException', function(err) {
  logger.error(err);
});

start();

