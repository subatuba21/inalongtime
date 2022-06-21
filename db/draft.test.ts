import {config} from 'dotenv';
import {ObjectId} from 'mongodb';
import logger from '../logger';
import {addDraft, DraftEntry, setDraftDb, modifyDraft,
  getDraft, ModifyDraftInput, DraftInput} from './draft';
import {getClient, getDb, setupDb} from './setup';

config();

beforeAll(async () => {
  await setupDb(process.env.MONGO_URL as string);
  setDraftDb(getDb());
});

beforeEach(async () => {
  const db = getDb();
  await db.collection('drafts').deleteMany({});
});

afterAll(async () => {
  const db = getDb();
  const client = getClient();
  await db.collection('drafts').deleteMany({});
  await client.close();
});

describe('Testing draft related db functionalities', () => {
  test('Testing addDraft', async () => {
    const db = getDb();
    const draftInput : DraftInput = {
      title: 'Test title',
      userId: new ObjectId().toString(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addDraft(draftInput);
    expect(res.success).toBe(true);
    let draft = await db.collection('drafts').
        findOne({_id: new ObjectId(res.draft?._id)}) as DraftEntry | null;
    expect(draft).toBeTruthy();
    draft = draft as DraftEntry;
    expect(draft.userId.toString()).toBe(draftInput.userId.toString());
    expect(draft.contentUrl).toBe(draftInput.contentUrl);
    expect(draft.description).toBe(draftInput.description);
    expect(draft.sendDate).toStrictEqual(draftInput.sendDate);
  });

  test('Testing getDraft', async () => {
    const draftInput : DraftInput = {
      title: 'Test title',
      userId: new ObjectId().toString(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addDraft(draftInput);
    expect(res.success).toBe(true);
    const draftResult = await getDraft(res.draft?._id as string);
    expect(draftResult.draft).toBeTruthy();
    expect(res.draft).toStrictEqual(draftResult.draft);
  });

  test('Testing modifyDraft', async () => {
    const draftInput : DraftInput = {
      title: 'Test title',
      userId: new ObjectId().toString(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addDraft(draftInput);
    logger.warn(res);
    expect(res.success).toBe(true);
    const updateDraftInput : ModifyDraftInput = {
      title: 'Test title updated',
    };
    const _id = res.draft?._id as string;

    const updateRes = await modifyDraft(_id, updateDraftInput);
    expect(updateRes.success).toBe(true);
    expect(updateRes.draft).toBeTruthy();
    expect(updateRes.draft?.title).toBe(updateDraftInput.title);
  });

  test('Testing modifying nonexistent draft', async () => {
    const updateDraftInput : ModifyDraftInput = {
      title: 'Test title updated',
    };
    const _id = new ObjectId().toString();

    const updateRes = await modifyDraft(_id, updateDraftInput);
    expect(updateRes.success).toBe(false);
    expect(updateRes.draft).toBeFalsy();
  });
});
