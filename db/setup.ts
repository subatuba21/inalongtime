import {MongoClient} from 'mongodb';
import logger from '../logger';


let client : MongoClient;
export const setupDB = async (mongourl: string) => {
  // eslint-disable-next-line max-len
  client = new MongoClient(mongourl);
  await client.connect().then(() => {
    logger.info('Connected to MongoDB');
  }, (err) => {
    logger.error('Error connecting to MongoDB: ' + err);
  });
};

export const getClient = () => {
  return client;
};
