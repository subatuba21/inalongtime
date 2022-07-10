import {Db, Collection, ObjectId} from 'mongodb';
import logger from '../logger';
import {DraftSchema} from 'shared/types/draft';
import {FutureType} from '../utils/schemas/future';
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

export type DraftInput = Omit<DraftSchema, '_id'>

export interface DraftDbResponse extends DbResponse {
    draft: DraftSchema | null;
}

export const addDraft =
    async (draft: DraftInput) : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.insertOne(
            {...draft, userId: new ObjectId(draft.userId)});
        if (res.acknowledged) {
          logger.verbose(`Added draft with id ${res.insertedId}`);
          return {
            success: true,
            draft: {
              ...draft,
              _id: res.insertedId.toString(),
            },
          };
        } else throw new Error('MongoDB error: write not allowed.');
      } catch (err: any) {
        logger.verbose(`Unable to add draft: err.message`);
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
      logger.verbose(`Found draft with id ${_id}`);
      return {
        success: true,
        draft: {...res, _id, userId:
          (res as any).userId.toString()} as DraftSchema,
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

export type ModifyDraftInput = Partial<DraftInput>;
export const modifyDraft =
    async (_id: string, draft : ModifyDraftInput)
    : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.findOneAndUpdate(
            {_id: new ObjectId(_id)}, {$set: draft}, {
              returnDocument: 'after',
            });
        if (res.value) {
          logger.verbose(`Modified draft with id ${_id}`);
          return {
            success: true,
            draft: {...res.value, _id,
              userId: res.value.userId.toString()} as DraftSchema,
          };
        } else {
          throw new Error('MongoDB error: write not allowed.');
        }
      } catch (err: any) {
        logger.verbose(`Unable to modify draft: ${err.message}`);
        return {
          success: false,
          error: err.message,
          draft: null,
        };
      }
    };
