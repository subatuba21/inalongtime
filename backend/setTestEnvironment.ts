import express from 'express';
import session from 'express-session';
import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {apiRouter} from './api/apiRouter';
import {DBManager} from './db/manager';
import path from 'path';
import {handleEndError} from './utils/handleEndError';

export const getTestExpressApp = () => {
  const app = express();

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  }));

  app.use('/api', async (req: express.Request) => {
    const mongod = await MongoMemoryServer.create();
    const mongoClient = new MongoClient(mongod.getUri());
    const dbManager = new DBManager(mongoClient.db('TEST_DB'));
    req.dbManager = dbManager;
  });

  app.use('/api', apiRouter);
  app.use(express.static(path.resolve(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
  });

  app.use(handleEndError);

  return app;
};
