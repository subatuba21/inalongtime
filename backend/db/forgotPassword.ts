import {Collection, Db} from 'mongodb';
import logger from '../logger';
import {DbResponse} from './setup';

let forgotPasswordCol : Collection;
export const setForgotPasswordCol = async (db: Db) => {
  forgotPasswordCol = db.collection('forgot_passwords');
};

export interface TokenResponse extends DbResponse {
  token: string;
  userId: string;
  expiry: Date;
}

export const addToken =
  async (token: string, userId: string) : Promise<TokenResponse> => {
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
  async (token: string) : Promise<TokenResponse> => {
    try {
      const res = await forgotPasswordCol.findOne({token});
      if (res && res.expiry > new Date()) {
        logger.verbose(`Found token with token ${token}`);
        return {
          success: true,
          token,
          userId: res.userId,
          expiry: res.expiry,
        };
      } else {
        throw new Error('Token not found.');
      }
    } catch (err: any) {
      logger.warn(`Unable to find token with token ${token}: ${err.message}`);
      return {
        success: false,
        error: err.message,
        token: '',
        userId: '',
        expiry: new Date(),
      };
    }
  };
