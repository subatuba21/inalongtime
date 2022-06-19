// eslint-disable-next-line max-len
import {getUser, getUserByEmail, registerUser, setUserDb, UserEntry} from './auth';
import {getClient, getDb, setupDb} from './setup';
import {config} from 'dotenv';
import md5 from 'md5';
import {ObjectId} from 'mongodb';

config();

beforeAll(async () => {
  await setupDb(process.env.MONGO_URL as string);
  setUserDb(getDb());
});

beforeEach(async () => {
  const db = getDb();
  await db.collection('users').deleteMany({});
});

afterAll(async () => {
  const db = getDb();
  const client = getClient();
  await db.collection('users').deleteMany({});
  await client.close();
});

describe('Testing auth-related db queries', () => {
  test('Testing registerUser', async () => {
    const db = getDb();

    const firstname = 'John';
    const lastname = 'Doe';
    const email = 'johndoe@gmail.com';
    const password = 'password';
    // eslint-disable-next-line max-len
    const res = await registerUser(firstname, lastname, email, password);
    expect(res.success).toBe(true);
    expect(res.user).toBeTruthy();

    // eslint-disable-next-line max-len
    let user = await db.collection('users').findOne({_id: new ObjectId((res.user as UserEntry)._id)}) as UserEntry | null;
    expect(user).toBeTruthy();
    user = user as UserEntry;
    expect(user.email).toBe(email);
    expect(user.firstname).toBe(firstname);
    expect(user.lastname).toBe(lastname);
    expect(user.password).toBe(md5(password));
  });

  test('Testing getUser', async () => {
    const firstname = 'John';
    const lastname = 'Doe';
    const email = 'johndoe@gmail.com';
    const password = 'password';

    const res = await registerUser(firstname, lastname, email, password);
    const user = await getUser((res.user as UserEntry)._id);
    expect(user.user).toStrictEqual(res.user as UserEntry);
  });

  test('Testing getUserByEmail', async () => {
    const firstname = 'John';
    const lastname = 'Doe';
    const email = 'johndoe@gmail.com';
    const password = 'password';

    const res = await registerUser(firstname, lastname, email, password);
    const user = await getUserByEmail((res.user as UserEntry).email);
    expect(user.user).toStrictEqual(res.user as UserEntry);
  });
});

