import {Collection, Db, ObjectId} from 'mongodb';
import {Future} from 'shared/dist/types/future';
import {futureSchema} from 'shared/types/future';
import logger from '../logger';
import {FutureSchema} from '../utils/schemas/future';
import {DbResponse} from './setup';

let futureCol : Collection;
export const setFutureDb = async (db: Db) => {
  futureCol = db.collection('futures');
};

export type FutureInput = Omit<Omit<FutureSchema, '_id'>, 'currentDate'>;

export interface FutureDbResponse extends DbResponse {
    future: Future | undefined;
}

export const addFuture =
    async (future: Future)
    : Promise<FutureDbResponse> => {
      try {
        logger.verbose(future);
        const res = await futureCol.insertOne(future);
        if (res.acknowledged) {
          logger.verbose(`Added future with id ${res.insertedId}`);
          return {
            success: true,
            future,
          };
        } else throw new Error('MongoDB error: write not allowed.');
      } catch (err: any) {
        logger.verbose(`Unable to add future: ${err.message}`);
        return {
          success: false,
          error: err.message,
          future: undefined,
        };
      }
    };

export const getFuture = async (_id: string) : Promise<FutureDbResponse> => {
  try {
    const res = await futureCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      logger.verbose(`Found future with id ${_id}`);
      return {
        success: true,
        future: futureSchema.parse(res),
      };
    } else {
      throw new Error('Future not found.');
    }
  } catch (err: any) {
    logger.verbose(`Unable to find future with id ${_id}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      future: undefined,
    };
  }
};

export const setFutureViewed = async (_id: string) : Promise<boolean> => {
  try {
    const res = await futureCol.updateOne(
        {_id: new ObjectId(_id)},
        {$set: {viewed: true}},
    );
    if (res.matchedCount === 1) {
      logger.verbose(`Updated future with id ${_id}`);
      return true;
    } else {
      throw new Error('Future not found.');
    }
  } catch (err: any) {
    logger.verbose(`Unable to update future with id ${_id}: ${err.message}`);
    return false;
  }
};
