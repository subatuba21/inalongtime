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
    async (draft: DraftInput) : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.insertOne(draft);
        if (res.acknowledged) {
          logger.info(`Added draft with id ${res.insertedId}`);
          return {
            success: true,
            draft: {
              ...draft as unknown as DraftEntry,
              _id: res.insertedId,
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

export interface MultipleDraftsDbResponse extends DbResponse {
    drafts: DraftEntry[];
}

export const getDraftsByUserId =
    async (userId: string) : Promise<MultipleDraftsDbResponse> => {
      try {
        logger.info('Trying to get drafts for UserId: ' + userId);
        const drafts = await draftCol.find({userId}).toArray();
        if (drafts.length>0) {
          logger.info(`Found drafts for user ${userId}`);
          const draftEntries = drafts as DraftEntry[];
          return {
            success: true,
            drafts: draftEntries,
          };
        } else {
          logger.info(`No drafts found for user ${userId}`);
          return {
            success: true,
            drafts: [],
          };
        }
      } catch (err: any) {
        logger.warning(
            `Unable to find drafts for user ${userId}: ${err.message}`);
        return {
          success: false,
          error: err.message,
          drafts: [],
        };
      }
    };

export const getDraft = async (_id: ObjectId) : Promise<DraftDbResponse> => {
  try {
    const res = await draftCol.findOne({_id});
    if (res) {
      logger.info(`Found draft with id ${_id}`);
      return {
        success: true,
        draft: res as DraftEntry,
      };
    } else {
      throw new Error('Draft not found.');
    }
  } catch (err: any) {
    logger.warning(`Unable to find draft with id ${_id}: ${err.message}`);
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
    async (_id: ObjectId, draft : ModifyDraftInput)
    : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.findOneAndUpdate(
            {_id: _id}, {$set: draft}, {
              returnDocument: 'after',
            });
        if (res.value) {
          logger.info(`Modified draft with id ${_id}`);
          return {
            success: true,
            draft: res.value as DraftEntry,
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
