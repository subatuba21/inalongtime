import {Db, MongoClient} from 'mongodb';
import logger from '../logger';
import {DBError} from './errors';


let db : Db;
let client : MongoClient;
export const setupDb = async (mongourl: string) => {
  client = new MongoClient(mongourl);
  await client.connect().then(() => {
    logger.info('Connected to MongoDB');
  }, (err) => {
    logger.error('Error connecting to MongoDB: ' + err);
  });

  const dbName = process.env.MONGO_DB_NAME as string;
  db = client.db(dbName);
};

export const getDb = () => {
  return db;
};

export const getClient = () => {
  return client;
};

export interface DbResponse {
    success: boolean;
    error?: DBError;
}

