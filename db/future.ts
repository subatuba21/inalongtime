import {Collection, Db, ObjectId} from 'mongodb';
import logger from '../logger';
import {DbResponse} from './setup';

let futureCol : Collection;
export const setFutureDb = async (db: Db) => {
  futureCol = db.collection('futures');
};

export type FutureType = 'memory' | 'reminder' | 'letter' | 'journal' | 'goals';

export interface FutureEntry {
    _id: ObjectId;
    userId: ObjectId;
    sendDate: Date;
    currentDate: Date;
    contentUrl: string;
    type: FutureType;
    title: string;
    description: string;
}

export interface FutureInput {
  userId: ObjectId;
  sendDate: Date;
  contentUrl: string;
  type: FutureType;
  title: string;
  description: string;
}

export interface FutureDbResponse extends DbResponse {
    future: FutureEntry | null;
}

export const addFuture =
    async (future: FutureInput)
    : Promise<FutureDbResponse> => {
      try {
        const currentDate = new Date();
        const res = await futureCol.insertOne({...future, currentDate});
        if (res.acknowledged) {
          logger.info(`Added future with id ${res.insertedId}`);
          return {
            success: true,
            future: {
              _id: res.insertedId,
              ...future,
              currentDate,
            },
          };
        } else throw new Error('MongoDB error: write not allowed.');
      } catch (err: any) {
        logger.warning(`Unable to add future: err.message`);
        return {
          success: false,
          error: err.message,
          future: null,
        };
      }
    };

export const getFuture = async (_id: string) : Promise<FutureDbResponse> => {
  try {
    const res = await futureCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      logger.info(`Found future with id ${_id}`);
      return {
        success: true,
        future: res as FutureEntry,
      };
    } else {
      throw new Error('Future not found.');
    }
  } catch (err: any) {
    logger.warning(`Unable to find future with id ${_id}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      future: null,
    };
  }
};


