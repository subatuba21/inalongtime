import {Db, Collection, ObjectId} from 'mongodb';
import logger from '../logger';
import {FutureType} from './future';
import {DbResponse} from './setup';

let draftCol : Collection;
export const setDraftDb = async (db: Db) => {
  draftCol = db.collection('drafts');
};

export interface DraftEntry {
    _id: string;
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
    userId: string;
    sendDate?: Date;
    contentUrl: string;
    type: FutureType;
    title: string;
    description?: string;
}

export const addDraft =
    async (draft: DraftInput) : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.insertOne(
            {...draft, userId: new ObjectId(draft.userId)});
        if (res.acknowledged) {
          logger.info(`Added draft with id ${res.insertedId}`);
          return {
            success: true,
            draft: {
              ...draft as DraftEntry,
              _id: res.insertedId.toString(),
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

export const getDraft = async (_id: string) : Promise<DraftDbResponse> => {
  try {
    const res = await draftCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      logger.info(`Found draft with id ${_id}`);
      return {
        success: true,
        draft: {...res, _id, userId:
          (res as any).userId.toString()} as DraftEntry,
      };
    } else {
      throw new Error('Draft not found.');
    }
  } catch (err: any) {
    logger.warn(`Unable to find draft with id ${_id}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      draft: null,
    };
  }
};

export interface ModifyDraftInput {
    sendDate?: Date;
    contentUrl?: string;
    type?: FutureType;
    title?: string;
    description?: string;
}

export const modifyDraft =
    async (_id: string, draft : ModifyDraftInput)
    : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.findOneAndUpdate(
            {_id: new ObjectId(_id)}, {$set: draft}, {
              returnDocument: 'after',
            });
        if (res.value) {
          logger.info(`Modified draft with id ${_id}`);
          return {
            success: true,
            draft: {...res.value, _id,
              userId: res.value.userId.toString()} as DraftEntry,
          };
        } else {
          throw new Error('MongoDB error: write not allowed.');
        }
      } catch (err: any) {
        logger.warn(`Unable to modify draft: ${err.message}`);
        return {
          success: false,
          error: err.message,
          draft: null,
        };
      }
    };
