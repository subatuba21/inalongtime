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

export const getFuturesBySenderId =
    async (senderId: string) : Promise<MultipleFutureDbResponse> => {
      try {
        const res = await futureCol.find(
            {userId: new ObjectId(senderId)}).toArray();

        logger.verbose(`Found futures with senderId ${senderId}`);
        return {
          success: true,
          futures: res.map((arg) => futureSchema.parse(arg)),
        };
      } catch (err: any) {
        logger.verbose(`Unable to find futures with senderId 
        ${senderId}: ${err.message}`);
        return {
          success: false,
          error: err.message,
          futures: [],
        };
      }
    };

export const getRecievedFutures =
    async (recipientId: string, recipientEmail: string)
    : Promise<MultipleFutureDbResponse> => {
      try {
        const res = await futureCol.find(
            {
              nextSendDate: {$lte: new Date()},
              $or: [
                {recipientEmail: {$eq: recipientEmail}},
                {backupEmail: {$eq: recipientEmail}},
                {
                  userId: {$eq: recipientId},
                  recipientType: {$eq: 'myself'},
                },
              ],
            }).toArray();

        logger.verbose(`Found futures with recipientId ${recipientId}`);
        return {
          success: true,
          futures: res.map((arg) => futureSchema.parse(arg)),
        };
      } catch (err: any) {
        logger.verbose(`Unable to find futures with recipientId 
        ${recipientId}: ${err.message}`);
        return {
          success: false,
          error: err.message,
          futures: [],
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

export interface MultipleFutureDbResponse extends DbResponse {
  futures: Future[];
}

export const getFuturesBySendDate =
    async (sendDate: Date) : Promise<MultipleFutureDbResponse> => {
      try {
        const beginningToday = new Date(sendDate.toDateString());
        const beginningTomorrow =
          new Date(beginningToday.getTime() + 24 * 60 * 60 * 1000);

        const res = await futureCol.find({nextSendDate: {
          $gte: beginningToday,
          $lt: beginningTomorrow,
        }}).toArray();

        logger.verbose(
            `Found ${res.length} futures with send date ${sendDate}`);
        return {
          success: true,
          futures: res.map((future) => futureSchema.parse(future)),
        };
      } catch (err: any) {
        logger.verbose(
            `Unable to find futures with send date 
            ${sendDate}: ${err.message}`);
        return {
          success: false,
          error: err.message,
          futures: [],
        };
      }
    };

export const getFuturesWeekOldNotVisited =
    async () : Promise<MultipleFutureDbResponse> => {
      try {
        const beginningToday = new Date(new Date().toDateString());

        const sevenDaysAgo = new Date(
            beginningToday.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sixDaysAgo = new Date(
            beginningToday.getTime() - 6 * 24 * 60 * 60 * 1000);

        const res = await futureCol.find({
          viewed: false,
          nextSendDate: {
            $lt: sixDaysAgo,
            $gte: sevenDaysAgo,
          },
        }).toArray();

        logger.verbose(
            `Found ${res.length} futures that are week old and not viewed`);
        return {
          success: true,
          futures: res.map((future) => futureSchema.parse(future)),
        };
      } catch (err: any) {
        logger.verbose(
            `Unable to find futures that are a week 
            old and not viewed ${err.message}`);
        return {
          success: false,
          error: err.message,
          futures: [],
        };
      }
    };


