import {config} from 'dotenv';
import {ObjectId} from 'mongodb';
import {addFuture,
  setFutureDb, getFuture, FutureInput} from './future';
import {FutureSchema} from '../utils/schemas/future';
import {getClient, getDb, setupDb} from './setup';

config();

beforeAll(async () => {
  await setupDb(process.env.MONGO_URL as string);
  setFutureDb(getDb());
});

beforeEach(async () => {
  const db = getDb();
  await db.collection('futures').deleteMany({});
});

afterAll(async () => {
  const db = getDb();
  const client = getClient();
  await db.collection('futures').deleteMany({});
  await client.close();
});

describe('Testing future-related db queries', () => {
  test('Testing addFuture', async () => {
    const db = getDb();
    const future : FutureInput = {
      title: 'Test title',
      userId: new ObjectId().toString(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addFuture(future);
    expect(res.success).toBe(true);

    let retrievedFuture = await db.collection('futures')
        .findOne({_id: new ObjectId(
            (res.future as FutureSchema)._id)}) as FutureSchema | null;
    expect(retrievedFuture).toBeTruthy();
    retrievedFuture = retrievedFuture as FutureSchema;
    expect(retrievedFuture.userId.toString()).toStrictEqual(future.userId);
    expect(retrievedFuture.contentUrl).toBe(future.contentUrl);
    expect(retrievedFuture.description).toBe(future.description);
    expect(retrievedFuture.sendDate).toStrictEqual(future.sendDate);
  });

  test('Testing getFuture', async () => {
    const future : FutureInput = {
      title: 'Test title',
      userId: new ObjectId().toString(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addFuture(future);
    expect(res.success).toBe(true);
    expect(res.future).toBeTruthy();
    const futureResponse = await getFuture(
        (res.future as FutureSchema)._id.toString());
    expect(futureResponse.success).toBe(true);
    expect(futureResponse.future).toStrictEqual(res.future);
  });
});
