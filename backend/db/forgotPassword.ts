import {Collection, Db} from 'mongodb';

let forgotPasswordCol : Collection;
export const setForgotPasswordCol = async (db: Db) => {
  forgotPasswordCol = db.collection('forgot_passwords');
};

export const addForgotPassword;
