import {Db, Collection, ObjectId} from 'mongodb';
import md5 from 'md5';
import {DbResponse} from './setup';

let userCol : Collection;
export const setUserDb = async (db: Db) => {
  userCol = db.collection('users');
};

export interface UserEntry {
    _id: ObjectId;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}

export interface UserInput {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

// eslint-disable-next-line max-len
export interface UserDbResponse extends DbResponse {
    user: UserEntry | null;
}

// eslint-disable-next-line max-len
export const registerUser = async (userInput: UserInput) : Promise<UserDbResponse> => {
  const hashedPass = md5(userInput.password);
  try {
    // eslint-disable-next-line max-len
    const user = await userCol.findOne({email: userInput.email});
    if (user) {
      return {success: false, error: 'User already exists', user: null};
    }

    const res = await userCol.insertOne(
        {...userInput, password: hashedPass});
    if (res.acknowledged) {
      return {
        success: true,
        user: {
          _id: res.insertedId,
          ...userInput,
          password: hashedPass,
        },
      };
    } else throw new Error('MongoDB error: write not allowed.');
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      user: null,
    };
  }
};

export const getUser = async (_id: string) : Promise<UserDbResponse> => {
  try {
    // eslint-disable-next-line max-len
    const res = await userCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      return {
        success: true,
        user: {...(res as unknown as UserEntry), _id: res._id},
      };
    } else throw new Error('User not found.');
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      user: null,
    };
  }
};

// eslint-disable-next-line max-len
export const getUserByEmail = async (email: string) : Promise<UserDbResponse> => {
  try {
    // eslint-disable-next-line max-len
    const res = await userCol.findOne({email});
    if (res) {
      return {
        success: true,
        user: {...(res as unknown as UserEntry), _id: res._id},
      };
    } else throw new Error('User not found.');
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      user: null,
    };
  }
};
