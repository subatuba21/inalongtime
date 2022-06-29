import {hash, compare} from 'bcrypt';

export const validatePassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};

export const hashPassword = async (password: string) => {
  const passwordHash = await hash(password, 10);
  return passwordHash;
};
