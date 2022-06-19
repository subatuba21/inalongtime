import {Db, Collection, ObjectId} from 'mongodb';
import logger from '../logger';
import {FutureType} from './future';
import {DbResponse} from './setup';

let draftCol : Collection;
export const setDraftDb = async (db: Db) => {
  draftCol = db.collection('drafts');
};

export interface DraftEntry {
    _id: ObjectId;
    userId: string;
    sendDate?: Date;
    contentUrl: string;
    type: FutureType;
    title: string;
    description?: string;
};

export interface DraftDbResponse extends DbResponse {
    draft: DraftEntry | null;
}

export interface DraftInput {
    userId: ObjectId;
    sendDate?: Date;
    contentUrl: string;
    type: FutureType;
    title: string;
    description?: string;
}

export const addDraft =
    async (draft: DraftInput) => {
      try {
        const res = await draftCol.insertOne(draft);
        if (res.acknowledged) {
          logger.info(`Added draft with id ${res.insertedId}`);
          return {
            success: true,
            draft: {
              _id: res.insertedId.toString(),
              ...draft,
            },
          };
        } else throw new Error('MongoDB error: write not allowed.');
      } catch (err: any) {
        logger.warning(`Unable to add draft: err.message`);
        return {
          success: false,
          error: err.message,
          draft: null,
        };
      }
    };
