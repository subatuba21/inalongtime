import {getTestSetup} from '../setTestEnvironment';
import {Express} from 'express';
import {TestDBManager} from '../utils/types/dbManager';
import fetch from 'node-fetch-cjs';
import {expect} from 'chai';
import nock from 'nock';
import * as x from '../db/auth';
import {getUserByEmail} from '../db/auth';
import {onGoogleLogin} from '../utils/passport/googleStrategy';
import sinon from 'sinon';


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
    const recaptchaToken = 'hbajhbcajhb';
    const scope = nock('https://www.google.com')
        .get('/recaptcha/api/siteverify')
        .query({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }).reply(200, {
          success: true,
        });
    const result : any = await fetch('http://localhost:1000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...TestUser,
          recaptchaToken,
        },
      }),
      headers: {'Content-Type': 'application/json'},
    }).then((res) => res.json());

    expect(scope.isDone()).to.be.true;
    expect(result.error).to.be.null;
    expect(result.data).to.not.be.null;
    expect(result.data).to.have.property('_id');
    expect(result.data.email).to.equal(TestUser.email);
    expect(result.data.firstname).to.equal(TestUser.firstname);
    expect(result.data.lastname).to.equal(TestUser.lastname);
  });

  it('Should fail to add an user with invalid recaptcha', async () => {
    const TestUser2 = {
      firstname: 'First2',
      lastname: 'Last2',
      email: 'testuser2@gmail.com',
      password: 'password',
    };
    const recaptchaToken = 'hbajhbcajhb';
    const scope = nock('https://www.google.com')
        .get('/recaptcha/api/siteverify')
        .query({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }).reply(400, {
          success: false,
        });
    const result : any = await fetch('http://localhost:1000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...TestUser2,
          recaptchaToken,
        },
      }),
      headers: {'Content-Type': 'application/json'},
    }).then((res) => res.json());

    expect(scope.isDone()).to.be.true;
    expect(result.error).to.not.be.null;
    console.log(result.error);

    const numUsers = await dbManager.getUserDB().countDocuments({});
    expect(numUsers).to.equal(1);
    expect(result.data).to.be.null;
  });

  it('Should not add a user with an existing email', async () => {
    const recaptchaToken = 'hbajhbcajhb';
    const scope = nock('https://www.google.com')
        .get('/recaptcha/api/siteverify')
        .query({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }).reply(200, {
          success: true,
        });
    const result : any = await fetch('http://localhost:1000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...TestUser,
          recaptchaToken,
        },
      }),
      headers: {'Content-Type': 'application/json'},
    }).then((res) => res.json());

    expect(scope.isDone()).to.be.true;
    expect(result.error).to.not.be.null;
    expect(result.data).to.be.null;
    console.log(result.error);
  });

  it('Should not add a user with an invalid email', async () => {
    const TestUser2 = {
      firstname: 'First2',
      lastname: 'Last2',
      email: 'testuser2gmail.com', // no @
      password: 'password',
    };
    const recaptchaToken = 'hbajhbcajhb';
    const scope = nock('https://www.google.com')
        .get('/recaptcha/api/siteverify')
        .query({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }).reply(200, {
          success: true,
        });
    const result : any = await fetch('http://localhost:1000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          ...TestUser2,
          recaptchaToken,
        },
      }),
      headers: {'Content-Type': 'application/json'},
    }).then((res) => res.json());

    expect(scope.isDone()).to.be.false;
    expect(result.error).to.not.be.null;
    expect(result.data).to.be.null;
    console.log(result.error);
  });

  const googleProfile = {
    sub: '1234567890',
    id: '1234567890',
    displayName: 'John Doe',
    given_name: 'John',
    family_name: 'Doe',
    email: 'johndoe@gmail.com',
    birthday: '0000-06-25',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14Gg2U...',
    locale: 'en',
  };
  it('Should add an user when logging in with google the first time',
      async () => {
        await onGoogleLogin(
          {dbManager} as any, 'udhushud', 'ndjndj', googleProfile, () => {
            console.log('done');
          });

        const userRes = await getUserByEmail(
            dbManager.getUserDB(), googleProfile.email);
        expect(userRes).to.not.be.null;
        expect(userRes.success).to.be.true;
        expect(userRes.user).to.not.be.null;
        console.log(userRes.user);
        expect(userRes.user?.email).to.equal(googleProfile.email);
        expect(userRes.user?.firstname).to.equal(googleProfile.given_name);
        expect(userRes.user?.lastname).to.equal(googleProfile.family_name);
      });

  it('Should log in an existing user when logging in with google',
      async () => {
        const stub = sinon.stub(x, 'registerGoogleUser').returns(
            Promise.resolve({
              success: false,
              user: null,
            }));
        await onGoogleLogin(
          {dbManager} as any, 'udhushud', 'ndjndj', googleProfile,
          (error: any, done: any) => {
            console.log(done);
            expect(error).to.be.null;
            expect(done).to.haveOwnProperty('email');
            expect(done.email).to.equal(googleProfile.email);
            expect(done.firstname).to.equal(googleProfile.given_name);
            expect(done.method).to.equal('google');
            expect(done.lastname).to.equal(googleProfile.family_name);
          });
        expect(stub.called).to.be.false;
        stub.restore();
      });
});
