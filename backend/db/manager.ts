import {Db} from 'mongodb';

export class DBManager {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  getUserDB() {
    return this.db.collection('users');
  }

  getDraftDB() {
    return this.db.collection('drafts');
  }

  getFutureDB() {
    return this.db.collection('futures');
  }

  getForgotPasswordDB() {
    return this.db.collection('forgot_passwords');
  }
}

