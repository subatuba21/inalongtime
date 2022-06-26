import express from 'express';
import {authRouter} from './api/auth';
import {futureRouter} from './api/future';
import {getDb, setupDb} from './db/setup';
import logger from './logger';
import {config} from 'dotenv';
import {setUserDb} from './db/auth';
import passport from 'passport';
import './utils/passport/setup';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {handleEndError} from './utils/handleEndError';
import path from 'path';

const app = express();
config();

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME,
  }),
  cookie: {
    maxAge: 43200000,
  },
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/future', futureRouter);
app.use('/api/auth', authRouter);
app.use('/public', express.static('public'));
app.use('/', express.static('frontend/build'));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// For anything that is async and needed by the server.
const start = async () => {
  await setupDb(process.env.MONGO_URL as string);
  const client = getDb();
  setUserDb(client);
  app.listen(3000, () => logger.info('Server started on port 3000'));
};

app.use(handleEndError);

process.on('uncaughtException', function(err) {
  logger.error(err);
});

start();

