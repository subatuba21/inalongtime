import {getTestSetup} from '../setTestEnvironment';
import {Express} from 'express';
import {TestDBManager} from '../utils/types/dbManager';
import fetch from 'node-fetch-cjs';
import {expect} from 'chai';
import nock from 'nock';

// let dbManager : DBManager;
let app : Express;
let dbManager : TestDBManager;

before(async () => {
  const setup = await getTestSetup();
  dbManager = setup.dbManager as TestDBManager;
  app = setup.server;
  dbManager.clearAllDBs();
  app.listen(1000);
});


describe('Testing register api', () => {
  const TestUser = {
    firstname: 'First',
    lastname: 'Last',
    email: 'firstlast@gmail.com',
    password: 'password',
  };
  it('Should successfully add an user', async () => {
    const result : any = await fetch('http://localhost:1000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...TestUser,
          recaptchaToken: 'hbajhbcajhb',
        },
      }),
      headers: {'Content-Type': 'application/json'},
    }).then((res) => res.json());

    console.log(result);
  });
});
