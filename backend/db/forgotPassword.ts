import {Collection} from 'mongodb';
import logger from '../logger';
import {DbResponse} from '../utils/types/dbResponse';

export interface TokenResponse extends DbResponse {
  token: string;
  userId: string;
  expiry: Date;
}

export const addToken =
  async (forgotPasswordCol : Collection,
      token: string, userId: string) : Promise<TokenResponse> => {
    try {
      const date = new Date(Date.now() + 1000*60*10);
      const res = await forgotPasswordCol.insertOne({
        token,
        userId,
        createdAt: new Date(),
        expiry: date,
      });
      if (res.acknowledged) {
        logger.verbose(`Added token with id ${res.insertedId}`);
        return {
          success: true,
          token,
          userId,
          expiry: date,
        };
      } else throw new Error('MongoDB error: write not allowed.');
    } catch (err: any) {
      logger.verbose(`Unable to add token: ${err.message}`);
      return {
        success: false,
        error: err.message,
        token: '',
        userId: '',
        expiry: new Date(),
      };
    }
  };

export const getToken =
  async (forgotPasswordCol : Collection, userId: string)
  : Promise<TokenResponse> => {
    try {
      const res = await forgotPasswordCol.findOne(
          {userId, expiry: {$gt: new Date()}});
      if (res) {
        logger.verbose(`Found token with user id ${userId}`);
        return {
          success: true,
          token: res.token,
          userId: res.userId,
          expiry: res.expiry,
        };
      } else {
        throw new Error('Token not found.');
      }
    } catch (err: any) {
      logger.warn(
          `Unable to find token with user id ${userId}: ${err.message}`);
      return {
        success: false,
        error: err.message,
        token: '',
        userId: '',
        expiry: new Date(),
      };
    }
  };

export const deleteToken =
  async (forgotPasswordCol : Collection, userId: string)
  : Promise<TokenResponse> => {
    try {
      const res = await forgotPasswordCol.deleteMany({userId});
      if (res.acknowledged) {
        logger.verbose(`Deleted token with user id ${userId}`);
        return {
          success: true,
          token: '',
          userId,
          expiry: new Date(),
        };
      } else {
        throw new Error('Token not found.');
      }
    } catch (err: any) {
      logger.warn(
          `Unable to delete token with user id ${userId}: ${err.message}`);
      return {
        success: false,
        error: err.message,
        token: '',
        userId: '',
        expiry: new Date(),
      };
    }
  };
