import {Collection, Db, ObjectId} from 'mongodb';
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
          contentUrl, type, title, currentDate, description});
        if (res.acknowledged) {
          return {
            success: true,
            future: {
              _id: res.insertedId.toString(),
              userId,
              sendDate,
              currentDate,
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

export const getFuture = async (_id: string) : Promise<FutureDbResponse> => {
  try {
    const res = await futureCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      return {
        success: true,
        future: {...(res as unknown as FutureEntry), _id: _id},
      };
    } else {
      throw new Error('Future not found.');
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      future: null,
    };
  }
};


