import express from 'express';
import {deleteResourceFromDraft} from '../../../db/draft';
import {deleteDraftResource} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
export const deleteResource =
async (req: express.Request, res: express.Response, next: Function) => {
  const user = req.user as UserSchema;
  const draftId = req.draft?.id as string;
  const resourceId = req.resourceId as string;
  await deleteDraftResource(req.storage, user._id, draftId, resourceId);
  await deleteResourceFromDraft(
      req.dbManager.getDraftDB(), draftId, resourceId);
  const response : APIResponse = {
    data: null,
    error: null,
  };
  res.end(JSON.stringify(response));
};
