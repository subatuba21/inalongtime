import {ObjectID} from 'mongodb';
import {alreadyThreeDrafts, unknownError} from 'shared/dist/types/apiErrors';
import {DraftType,
  DraftResponseBody, draftResponseBody} from 'shared/dist/types/draft';
import {addDraftIdToUser} from '../../../db/auth';
import {addDraft} from '../../../db/draft';
import {getContentFilename} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
import express from 'express';

export const addNewDraft =
    async (req: express.Request, res: express.Response, next: Function) => {
      const draftType = req.draft?.type as DraftType;
      const user = req.user as UserSchema;
      const numDrafts = user.draftIDs ? user.draftIDs.length : 0;

      if (numDrafts===undefined || numDrafts >= 3) {
        const response : APIResponse = {
          data: null,
          error: alreadyThreeDrafts,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
        return;
      }

      const draftID = new ObjectID();
      const result = await addDraft({
        userId: user._id,
        type: draftType,
        recipientType: 'myself',
        recipientEmail: '',
        title: '',
        backupEmail: '',
        phoneNumber: '',
        nextSendDate: new Date(new Date().setFullYear(
            new Date().getFullYear() + 1)),
        contentCloudStoragePath: getContentFilename(
            user._id, draftID.toString()),
        lastEdited: new Date(),
        resources: [],
      }, draftID);

      const error = await addDraftIdToUser(user._id, draftID.toString());

      const draftRes : DraftResponseBody = await draftResponseBody.parseAsync({
        content: {},
        properties: result.draft,
      });

      if (result.success && !error) {
        const response : APIResponse = {
          data: draftRes,
          error: null,
        };
        res.end(JSON.stringify(response));
      } else {
        const response : APIResponse = {
          data: null,
          error: unknownError,
        };
        res.status(response.error?.code as number)
            .end(JSON.stringify(response));
        return;
      }
    };
