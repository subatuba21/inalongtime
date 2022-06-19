import {config} from 'dotenv';
import {ObjectId} from 'mongodb';
import {addFuture, FutureEntry, FutureType,
  setFutureDb, getFuture} from './future';
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
    const userId = new ObjectId();
    const title = 'Test title';
    const type : FutureType = 'letter';
    const description = 'Test description';
    const sendDate = new Date('2025-01-01');
    const contentUrl = 'https://www.google.com';
    const res = await addFuture(userId.toString(), sendDate,
        contentUrl, type, title, description);
    expect(res.success).toBe(true);

    let future = await db.collection('futures').findOne({_id: new ObjectId(
        (res.future as FutureEntry)._id)}) as FutureEntry | null;
    expect(future).toBeTruthy();
    future = future as FutureEntry;
    expect(future?.userId).toBe(userId.toString());
    expect(future.contentUrl).toBe(contentUrl);
    expect(future.description).toBe(description);
    expect(future.sendDate).toStrictEqual(sendDate);
  });

  test('Testing getFuture', async () => {
    const userId = new ObjectId();
    const title = 'Test title';
    const type : FutureType = 'letter';
    const description = 'Test description';
    const sendDate = new Date('2025-01-01');
    const contentUrl = 'https://www.google.com';
    const res = await addFuture(userId.toString(), sendDate,
        contentUrl, type, title, description);
    expect(res.success).toBe(true);
    expect(res.future).toBeTruthy();
    const futureResponse = await getFuture((res.future as FutureEntry)._id);
    expect(futureResponse.success).toBe(true);
    expect(res.future).toStrictEqual(futureResponse.future);
  });
});
