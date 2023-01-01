import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {DBManager} from './db/manager';
import {MongoClient} from 'mongodb';
import {apiRouter} from './api/apiRouter';
import path from 'path';
import {handleEndError} from './utils/handleEndError';
import {EnvironmentSetup} from './utils/types/environment';
import {Storage} from '@google-cloud/storage';

export const getSetup : EnvironmentSetup = async () => {
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

  const mongoClient = new MongoClient(process.env.MONGO_URL as string);
  await mongoClient.connect();
  const db = mongoClient.db(process.env.MONGO_DB_NAME as string);
  const dbManager = new DBManager(db);

  const storage = new Storage({
    keyFilename:
    `${__dirname}/${process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE_PATH}`,
  });

  app.use('/api', async (req: express.Request, res: express.Response, next) => {
    req.dbManager = dbManager;
    req.storage = storage;
    next();
  });


  app.use('/api', apiRouter);
  app.use(express.static(path.resolve(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
  });

  app.use(handleEndError);

  return {
    server: app,
    dbManager,
    storage,
  };
};
