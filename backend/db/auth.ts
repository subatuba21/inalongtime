import {Collection, ObjectId} from 'mongodb';
import {hashPassword} from '../utils/password';
import {GoogleUserInput, RegisterUserInput,
  UserSchema} from '../utils/schemas/user';
import logger from '../logger';
import {DBError} from './errors';
import {DbResponse} from '../utils/types/dbResponse';

export interface UserDbResponse extends DbResponse {
    user: UserSchema | null;
}

// eslint-disable-next-line max-len
export const registerUser = async (userCol: Collection, userInput: RegisterUserInput) : Promise<UserDbResponse> => {
  const hashedPass = await hashPassword(userInput.password);
  try {
    logger.verbose(`registering user: ${userInput}`);
    const user = await userCol.findOne({email: userInput.email});
    if (user) {
      logger.verbose(`user already exists: ${userInput}`);
      return {success: false,
        error: DBError.UNIQUE_ENTITY_ALREADY_EXISTS, user: null};
    }

    const res = await userCol.insertOne(
        {
          email: userInput.email,
          firstname: userInput.firstname,
          lastname: userInput.lastname,
          passwordHash: hashedPass,
        },
    );
    if (res.acknowledged) {
      return {
        success: true,
        user: {
          _id: res.insertedId.toString(),
          email: userInput.email,
          firstname: userInput.firstname,
          lastname: userInput.lastname,
          passwordHash: hashedPass,
        },
      };
    } else throw new Error('MongoDB error: write not allowed.');
  } catch (err: any) {
    logger.verbose(`Other error: ${err.message}`);
    return {
      success: false,
      error: err.message,
      user: null,
    };
  }
};

export const registerGoogleUser =
  async (userCol: Collection, input: GoogleUserInput)
    : Promise<UserDbResponse> => {
    try {
      logger.verbose(`registering google user user: ${input.email}`);
      const user = await userCol.findOne({email: input.email});
      if (user) {
        return {
          success: false,
          error: DBError.UNIQUE_ENTITY_ALREADY_EXISTS, user: null};
      }

      const res = await userCol.insertOne(
          {
            email: input.email,
            firstname: input.firstname,
            lastname: input.lastname,
            method: 'google',
          },
      );

      if (res.acknowledged) {
        return {
          success: true,
          user: {
            _id: res.insertedId.toString(),
            email: input.email,
            firstname: input.firstname,
            lastname: input.lastname,
            method: 'google',
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

export const getUser = async (userCol: Collection, _id: string)
    : Promise<UserDbResponse> => {
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
export const getUserByEmail = async (userCol: Collection, email: string) : Promise<UserDbResponse> => {
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

export const addDraftIdToUser = async (userCol: Collection,
    userID: string, draftID: string) => {
  try {
    const result = await userCol.updateOne({
      _id: new ObjectId(userID),
    }, {
      $addToSet: {
        draftIDs: draftID,
      },
    });

    if (!result.acknowledged) throw new Error();
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};

export const deleteDraftIdFromUser =
  async (userCol: Collection, userID: string, draftID: string) => {
    try {
      await userCol.updateOne({
        _id: new ObjectId(userID),
      }, {
        $pull: {
          draftIDs: draftID,
        },
      });
    } catch (err) {
      return DBError.ENTITY_NOT_FOUND;
    }
  };

export const addFutureIdToUser = async (userCol: Collection,
    userID: string, futureID: string) => {
  try {
    await userCol.updateOne({
      _id: new ObjectId(userID),
    }, {
      $addToSet: {
        futureIDs: futureID,
      },
    });
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};

export const deleteFutureIdFromUser =
  async (userCol: Collection, userID: string, futureID: string) => {
    try {
      await userCol.updateOne({
        _id: new ObjectId(userID),
      }, {
        $pull: {
          futureIDs: futureID,
        },
      });
    } catch (err) {
      return DBError.ENTITY_NOT_FOUND;
    }
  };

export const changePassword = async (userCol: Collection,
    userID: string, newPassword: string) => {
  try {
    const hashedPass = await hashPassword(newPassword);
    await userCol.updateOne({
      _id: new ObjectId(userID),
    }, {
      $set: {
        passwordHash: hashedPass,
      },
    });
  } catch (err) {
    return DBError.ENTITY_NOT_FOUND;
  }
};
