import express from 'express';
import {authRouter} from './api/auth';
import {futureRouter} from './api/future';
import {setupDB} from './db/setup';
import logger from './logger';
import {config} from 'dotenv';

const app = express();
config();


app.use('/api/future', futureRouter);
app.use('/api/auth', authRouter);
app.use('/public', express.static('public'));
app.use('/', express.static('frontend/build'));

// For anything that is async and needed by the server.
const start = async () => {
  await setupDB(process.env.MONGO_URL as string);
  app.listen(3000, () => logger.info('Server started on port 3000'));
};

process.on('uncaughtException', function(err) {
  logger.error(err);
});

start();

