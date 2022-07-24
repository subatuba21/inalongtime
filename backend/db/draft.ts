import {Db, Collection, ObjectId} from 'mongodb';
import logger from '../logger';
import {DraftSchema, miniDraft, MiniDraft
  , UserDraftsResponseData} from 'shared/dist/types/draft';
import {DbResponse} from './setup';
import {DBError} from './errors';

let draftCol : Collection;
export const setDraftDb = async (db: Db) => {
  draftCol = db.collection('drafts');
};

export type DraftInput = Omit<DraftSchema, '_id'>

export interface DraftDbResponse extends DbResponse {
    draft: DraftSchema | null;
}

export const addDraft =
    async (draft: DraftInput, _id?: ObjectId) : Promise<DraftDbResponse> => {
      try {
        const res = await draftCol.insertOne(
            {...draft, userId: new ObjectId(draft.userId),
              _id: _id ? _id : new ObjectId()});
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
        logger.verbose(`Unable to add draft: ${err.message}`);
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

export const getNumberOfUserDrafts =
  async (userId: string) : Promise<number | undefined> => {
    try {
      const res = await draftCol.countDocuments({userId: {
        $eq: new ObjectId(userId),
      }});
      return res;
    } catch {
      return undefined;
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

export const deleteDraft = async (_id: string) : Promise<DraftDbResponse> => {
  try {
    const res = await draftCol.findOneAndDelete({_id: new ObjectId(_id)});
    if (res && res.value) {
      logger.verbose(`Found draft with id ${_id}`);
      return {
        success: true,
        draft: {...res.value, _id, userId:
              res.value.userId.toString()} as DraftSchema,
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

interface getUserDraftsDbResponse extends DbResponse {
  draftData?: UserDraftsResponseData,
}

export const getUserDrafts = async (userId: string) :
  Promise<getUserDraftsDbResponse> => {
  try {
    const drafts : MiniDraft[] = [];
    const res = await draftCol.find({userId: {
      $eq: new ObjectId(userId),
    }});

    await res.forEach((doc) => {
      drafts.push(miniDraft.parse({...doc,
        userId: doc.userId.toString(), _id: doc._id.toString()}));
    });

    return {
      success: true,
      draftData: {
        drafts,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: DBError.UNKNOWN,
    };
  }
};

export const addResourceToDraft = async (
    draftId: string, resourceId: string) => {
  try {
    const result = await draftCol.updateOne({
      _id: new ObjectId(draftId),
    }, {
      $addToSet: {
        resources: resourceId,
      },
    });

    if (!result.acknowledged) {
      throw new Error(
          'Unable to add resource to draft');
    }
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};

export const deleteResourceFromDraft = async (
    draftId: string, resourceId: string) => {
  try {
    const result = await draftCol.updateOne({
      _id: new ObjectId(draftId),
    }, {
      $pull: {
        resources: resourceId,
      },
    });

    if (!result.acknowledged) throw new Error();
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};
