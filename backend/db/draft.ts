import {Collection, ObjectId} from 'mongodb';
import logger from '../logger';
import {DraftSchema, miniDraft, MiniDraft,
  Resource, UserDraftsResponseData} from 'shared/dist/types/draft';
import {DBError} from './errors';
import {DbResponse} from '../utils/types/dbResponse';


export type DraftInput = Omit<DraftSchema, '_id'>

export interface DraftDbResponse extends DbResponse {
    draft: DraftSchema | null;
}

export const addDraft =
    async (draftCol: Collection, draft: DraftInput, _id?: ObjectId)
    : Promise<DraftDbResponse> => {
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

export const getDraft = async (draftCol: Collection, _id: string)
: Promise<DraftDbResponse> => {
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
    logger.warn(`Unable to find a draft with id ${_id}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      draft: null,
    };
  }
};

export type ModifyDraftInput = Partial<DraftInput>;
export const modifyDraft =
    async (draftCol: Collection, _id: string, draft : ModifyDraftInput)
    : Promise<DraftDbResponse> => {
      try {
        if (draft.userId) delete draft.userId;
        // Not allowed to change userId of draft
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

export const deleteDraft = async (draftCol: Collection, _id: string)
: Promise<DraftDbResponse> => {
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

export const getUserDrafts = async (draftCol: Collection, userId: string) :
  Promise<getUserDraftsDbResponse> => {
  try {
    const drafts : MiniDraft[] = [];
    const res = draftCol.find({userId: {
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

export const addResourceToDraft =
  async (draftCol: Collection, draftId: string, resource: Resource) => {
    try {
      const result = await draftCol.updateOne({
        _id: new ObjectId(draftId),
      }, {
        $addToSet: {
          resources: {...resource, id: resource.id},
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
    draftCol: Collection, draftId: string, resourceId: string) => {
  try {
    const result = await draftCol.updateOne({
      _id: new ObjectId(draftId),
    }, {
      $pull: {
        resources: {
          id: resourceId,
        },
      },
    });

    if (!result.acknowledged) throw new Error();
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};
