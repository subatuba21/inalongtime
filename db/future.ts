import {Collection, Db} from 'mongodb';
import {DbResponse} from './setup';

let futureCol : Collection;
export const setFutureDb = async (db: Db) => {
  futureCol = db.collection('futures');
};

export type FutureType = 'memory' | 'reminder' | 'letter' | 'journal' | 'goals';

export interface FutureEntry {
    _id: string;
    userId: string;
    sendDate: Date;
    currentDate: Date;
    contentUrl: string;
    type: FutureType;
    title: string;
    description: string;
}

export interface FutureDbResponse extends DbResponse {
    future: FutureEntry | null;
}

export const addFuture =
    async (userId: string, sendDate: Date, contentUrl: string,
        type: FutureType, title: string, description: string)
    : Promise<FutureDbResponse> => {
      try {
        const currentDate = new Date();
        const res = await futureCol.insertOne({userId, sendDate,
          contentUrl, type, title, currentDate, description, published: false});
        if (res.acknowledged) {
          return {
            success: true,
            future: {
              _id: res.insertedId.toString(),
              userId,
              sendDate,
              currentDate: new Date(),
              contentUrl,
              type,
              title,
              description,
            },
          };
        } else throw new Error('MongoDB error: write not allowed.');
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
          future: null,
        };
      }
    };


