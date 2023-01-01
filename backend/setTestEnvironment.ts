import {config} from 'dotenv';
config({
  path: `${__dirname}/.env.test`,
});

import express from 'express';
import session from 'express-session';
import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {apiRouter} from './api/apiRouter';
import {DBManager} from './db/manager';
import path from 'path';
import {handleEndError} from './utils/handleEndError';
import MongoStore from 'connect-mongo';
import {EnvironmentSetup} from './utils/types/environment';
import {Storage} from '@google-cloud/storage';

export const getTestSetup : EnvironmentSetup = async () => {
  const app = express();
  const mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const uri = mongoServer.getUri();

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: uri,
    }),
  }));

  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  const db = mongoClient.db('test_db');
  const dbManager = new DBManager(db);

  const storage = new Storage({
    keyFilename:
    `${__dirname}/${process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE_PATH}`,
  });

  app.use('/api', async (req: express.Request, res: express.Response, next) => {
    req.dbManager = dbManager;
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
    dbManager: dbManager,
    storage,
  };
};
