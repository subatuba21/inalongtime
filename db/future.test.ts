import {config} from 'dotenv';
import {ObjectId} from 'mongodb';
import {addFuture, FutureEntry,
  setFutureDb, getFuture, FutureInput} from './future';
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
      userId: new ObjectId(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addFuture(future);
    expect(res.success).toBe(true);

    let retrievedFuture = await db.collection('futures')
        .findOne({_id: (res.future as FutureEntry)._id}) as FutureEntry | null;
    expect(retrievedFuture).toBeTruthy();
    retrievedFuture = retrievedFuture as FutureEntry;
    expect(retrievedFuture.userId).toStrictEqual(future.userId);
    expect(retrievedFuture.contentUrl).toBe(future.contentUrl);
    expect(retrievedFuture.description).toBe(future.description);
    expect(retrievedFuture.sendDate).toStrictEqual(future.sendDate);
  });

  test('Testing getFuture', async () => {
    const future : FutureInput = {
      title: 'Test title',
      userId: new ObjectId(),
      contentUrl: 'https://www.google.com',
      description: 'Test description',
      sendDate: new Date('2025-01-01'),
      type: 'letter',
    };
    const res = await addFuture(future);
    expect(res.success).toBe(true);
    expect(res.future).toBeTruthy();
    const futureResponse = await getFuture(
        (res.future as FutureEntry)._id.toString());
    expect(futureResponse.success).toBe(true);
    expect(futureResponse.future).toStrictEqual(res.future);
  });
});
