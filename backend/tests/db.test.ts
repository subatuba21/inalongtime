import {getTestSetup} from '../setTestEnvironment';
import {addDraftIdToUser, deleteDraftIdFromUser, getUser,
  getUserByEmail, registerUser} from '../db/auth';
import {DBManager} from '../db/manager';
import {assert, expect} from 'chai';


let dbManager : DBManager;
before(async () => {
  const setup = await getTestSetup();
  dbManager = setup.dbManager;
});

describe('Testing basic auth functions', () => {
  it('Should add an user and retrieve it', async () => {
    const userDb = dbManager.getUserDB();
    const res = await registerUser(dbManager.getUserDB(), {
      firstname: 'Test',
      lastname: 'User',
      email: 'testuser@gmail.com',
      password: 'testpassword',
      recaptchaToken: 'testtoken',
    });

    assert.equal(res.success, true);
    const queryRes = userDb.find({email: 'testuser@gmail.com'});
    let count = 0;
    let userRes : any;
    await queryRes.forEach((user) => {
      count++;
      userRes = user;
    });

    console.log(userRes);

    assert.equal(count, 1);
    assert.equal(userRes.firstname, 'Test');
    assert.equal(userRes.lastname, 'User');
    assert.equal(userRes.email, 'testuser@gmail.com');
    assert.equal(userRes._id, res.user?._id);

    const user = await getUser(userDb, userRes._id);
    assert.equal(user.success, true);
    assert.equal(user.user?.firstname, 'Test');
    assert.equal(user.user?.lastname, 'User');
    assert.equal(user.user?.email, 'testuser@gmail.com');

    console.log(user.user);
  });

  it('Should not add an user with the same email', async () => {
    const userDb = dbManager.getUserDB();
    const secondRes = await registerUser(userDb, {
      firstname: 'Test2',
      lastname: 'User2',
      email: 'testuser@gmail.com',
      password: 'testpassword',
      recaptchaToken: 'testtoken',
    });

    assert.equal(secondRes.success, false);
  });

  it('should retrieve user by email', async () => {
    const userDb = dbManager.getUserDB();
    const user = await getUserByEmail(userDb, 'testuser@gmail.com');
    assert.equal(user.success, true);
    assert.equal(user.user?.firstname, 'Test');
    assert.equal(user.user?.lastname, 'User');
    assert.equal(user.user?.email, 'testuser@gmail.com');
  });

  it('should add draftId to user and delete it', async () => {
    const userDb = dbManager.getUserDB();
    let user = await getUserByEmail(userDb, 'testuser@gmail.com');
    assert.equal(user.success, true);

    const draftId = 'testDraftId';
    const error = await addDraftIdToUser(
        userDb, user.user?._id as string, draftId);
    assert.equal(error, undefined);

    user = await getUserByEmail(userDb, 'testuser@gmail.com');
    expect(user.user?.draftIDs).to.include(draftId);

    const error2 = await deleteDraftIdFromUser(
        userDb, user.user?._id as string, draftId);
    assert.equal(error2, undefined);

    user = await getUserByEmail(userDb, 'testuser@gmail.com');
    assert.equal(user.success, true);

    expect(user.user?.draftIDs).to.not.include(draftId);
  });
});
