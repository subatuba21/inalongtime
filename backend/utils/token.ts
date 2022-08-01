import {ObjectId} from 'mongodb';
import {hashPassword, validatePassword} from './password';

export const hashToken = async (token: string) => await hashPassword(token);
export const validateToken =
    async (token: string, hash: string) => await validatePassword(token, hash);
export const createToken = () => (new ObjectId()).toString();
