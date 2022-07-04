import {Db, Collection, ObjectId} from 'mongodb';
import {hashPassword} from '../utils/hash';
import {DbResponse} from './setup';
import {RegisterUserInput, UserSchema} from '../utils/schemas/user';
import logger from '../logger';
import {DBError} from './errors';

let userCol : Collection;
export const setUserDb = async (db: Db) => {
  userCol = db.collection('users');
};

export interface UserDbResponse extends DbResponse {
    user: UserSchema | null;
}

// eslint-disable-next-line max-len
export const registerUser = async (userInput: RegisterUserInput) : Promise<UserDbResponse> => {
  const hashedPass = await hashPassword(userInput.password);
  try {
    logger.verbose(`registering user: ${userInput}`);
    const user = await userCol.findOne({email: userInput.email});
    if (user) {
      return {success: false,
        error: DBError.UNIQUE_ENTITY_ALREADY_EXISTS, user: null};
    }

    const res = await userCol.insertOne(
        {...userInput, passwordHash: hashedPass});
    if (res.acknowledged) {
      return {
        success: true,
        user: {
          _id: res.insertedId.toString(),
          ...userInput,
          passwordHash: hashedPass,
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
    logger.verbose(`finding user with _id: ${_id}`);
    const res = await userCol.findOne({_id: new ObjectId(_id)});
    if (res) {
      return {
        success: true,
        user: {...res, _id: res._id.toString()} as UserSchema,
      };
    } else throw new Error(DBError.ENTITY_NOT_FOUND);
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
    logger.verbose(`finding user with email: ${email}`);
    const res = await userCol.findOne({email});
    if (res) {
      return {
        success: true,
        user: {...res, _id: res._id.toString()} as UserSchema,
      };
    } else throw new Error(DBError.ENTITY_NOT_FOUND);
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      user: null,
    };
  }
};
