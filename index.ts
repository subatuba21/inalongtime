import express from 'express';
import {authRouter} from './api/auth';
import {futureRouter} from './api/future';
import logger from './logger';
// import {serveReact} from './utils/serveReact';

const app = express();

app.use('/api/future', futureRouter);
app.use('/api/auth', authRouter);
app.use('/public', express.static('public'));
app.use('/', express.static('frontend/build'));

app.listen(3000, () => logger.info('Server started on port 3000'));
process.on('uncaughtException', function(err) {
  logger.error(err);
});

