// eslint-disable-next-line max-len
import {getUser, getUserByEmail, registerUser, setUserDb} from './auth';
import {getClient, getDb, setupDb} from './setup';
import {config} from 'dotenv';
import md5 from 'md5';
import {ObjectId} from 'mongodb';
import {RegisterUserInput, UserSchema} from '../utils/schemas/user';

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

    const userInput : RegisterUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    };
    const res = await registerUser(userInput);
    expect(res.success).toBe(true);
    expect(res.user).toBeTruthy();

    let user = await db.collection('users').findOne(
        {_id: new ObjectId((res.user as UserSchema)._id)}) as UserSchema | null;
    expect(user).toBeTruthy();
    user = user as UserSchema;
    expect(user.email).toBe(userInput.email);
    expect(user.firstname).toBe(userInput.firstname);
    expect(user.lastname).toBe(userInput.lastname);
    expect(user.passwordHash).toBe(md5(userInput.password));
  });

  test('adding a duplicate user should be stopped', async () => {
    const userInput : RegisterUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    };
    // eslint-disable-next-line max-len
    const res = await registerUser(userInput);
    expect(res.success).toBe(true);

    const dup = await registerUser(userInput);
    expect(dup.success).toBe(false);
  });

  test('Testing getUser', async () => {
    const userInput : RegisterUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    };

    const res = await registerUser(userInput);
    const user = await getUser((res.user as UserSchema)._id.toString());
    expect(user.user).toStrictEqual(res.user as UserSchema);
  });

  test('Testing getUserByEmail', async () => {
    const userInput : RegisterUserInput = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    };

    const res = await registerUser(userInput);
    const user = await getUserByEmail((res.user as UserSchema).email);
    expect(user.user).toStrictEqual(res.user as UserSchema);
  });
});

