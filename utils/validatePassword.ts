import md5 from 'md5';

export const validatePassword = (password: string, hash: string) => {
  return md5(password) === hash;
};
