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

export class TestDBManager extends DBManager {
  async clearAllDBs() {
    await this.getUserDB().deleteMany({});
    await this.getDraftDB().deleteMany({});
    await this.getFutureDB().deleteMany({});
    await this.getForgotPasswordDB().deleteMany({});
  }

  async clearUserDB() {
    await this.getUserDB().deleteMany({});
  }

  async clearDraftDB() {
    await this.getDraftDB().deleteMany({});
  }

  async clearFutureDB() {
    await this.getFutureDB().deleteMany({});
  }
}


