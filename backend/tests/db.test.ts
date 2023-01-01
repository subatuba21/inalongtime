import {getTestSetup} from '../setTestEnvironment';
import {addDraftIdToUser, addFutureIdToUser,
  changePassword,
  deleteDraftIdFromUser, deleteFutureIdFromUser, getUser,
  getUserByEmail, registerUser} from '../db/auth';
import {DBManager} from '../db/manager';
import {assert, expect} from 'chai';
import {addDraft, addResourceToDraft,
  deleteDraft, deleteResourceFromDraft, DraftInput,
  getDraft, getUserDrafts, modifyDraft} from '../db/draft';


let dbManager : DBManager;
before(async () => {
  const setup = await getTestSetup();
  dbManager = setup.dbManager;
});

const TestUser = {
  firstname: 'Test',
  lastname: 'User',
  email: 'testuser@gmail.com',
  password: 'testpassword',
  recaptchaToken: 'testtoken',
  id: '',
};

describe('Testing basic auth functions', () => {
  it('Should add an user and retrieve it', async () => {
    const userDb = dbManager.getUserDB();
    const res = await registerUser(dbManager.getUserDB(), TestUser);

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
    TestUser.id = res.user?._id as any;

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

  it('should add futureId to user and delete it', async () => {
    const userDb = dbManager.getUserDB();
    let user = await getUserByEmail(userDb, 'testuser@gmail.com');
    assert.equal(user.success, true);

    const futureID = 'testFutureId';
    const error = await addFutureIdToUser(
        userDb, user.user?._id as string, futureID);
    assert.equal(error, undefined);

    user = await getUserByEmail(userDb, 'testuser@gmail.com');
    expect(user.user?.futureIDs).to.include(futureID);

    const error2 = await deleteFutureIdFromUser(
        userDb, user.user?._id as string, futureID);
    assert.equal(error2, undefined);

    user = await getUserByEmail(userDb, 'testuser@gmail.com');
    assert.equal(user.success, true);

    expect(user.user?.futureIDs).to.not.include(futureID);
  });

  it('Should have a different passwordHash after changing password',
      async () => {
        const userDb = dbManager.getUserDB();
        const user = await getUserByEmail(userDb, 'testuser@gmail.com');
        assert.equal(user.success, true);

        const oldPasswordHash = user.user?.passwordHash;
        const error = await changePassword(
            userDb, user.user?._id as string, 'newpassword');
        assert.equal(error, undefined);

        const user2 = await getUserByEmail(userDb, 'testuser@gmail.com');
        assert.equal(user2.success, true);
        expect(user2.user?.passwordHash).to.not.equal(oldPasswordHash);
      });
});

const TestDraft : DraftInput = {
  title: 'Test Draft',
  type: 'letter',
  userId: TestUser.id,
  recipientType: 'myself',
  lastEdited: new Date(),
  nextSendDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
  phoneNumber: '1234567890',
  backupEmail: TestUser.email,
  contentCloudStoragePath: 'none',
  resources: [],
};

let testDraftId: string = '';

describe('Testing draft dunctions', () => {
  it('Should add a draft and retrieve it', async () => {
    const draftDb = dbManager.getDraftDB();
    const userDb = dbManager.getUserDB();
    const user = await getUserByEmail(userDb, TestUser.email);
    expect(user.success).to.equal(true);
    TestDraft.userId = TestUser.id;

    const addDraftResponse = await addDraft(
        draftDb, TestDraft);

    expect(addDraftResponse.success).to.equal(true);
    testDraftId = addDraftResponse.draft?._id as string;

    const getDraftRes = await getDraft(
        draftDb, addDraftResponse.draft?._id as string);
    expect(getDraftRes.success).to.equal(true);
    expect(getDraftRes.draft?.title).to.equal(TestDraft.title);
    expect(getDraftRes.draft?.type).to.equal(TestDraft.type);
    expect(getDraftRes.draft?.userId).to.equal(TestDraft.userId);
    expect(getDraftRes.draft?._id).to.not.equal(TestDraft.userId);
    expect(getDraftRes.draft?.recipientType).to.equal(TestDraft.recipientType);
    expect(getDraftRes.draft?.lastEdited).to.eql(TestDraft.lastEdited);
    expect(getDraftRes.draft?.nextSendDate).to.eql(TestDraft.nextSendDate);
    expect(getDraftRes.draft?.phoneNumber).to.equal(TestDraft.phoneNumber);
    expect(getDraftRes.draft?.backupEmail).to.equal(TestDraft.backupEmail);

    expect(getDraftRes.draft?.contentCloudStoragePath)
        .to.equal(TestDraft.contentCloudStoragePath);
    expect(getDraftRes.draft?.resources).to.eql(TestDraft.resources);
  });

  it('Should update a draft', async () => {
    const draftDb = dbManager.getDraftDB();
    const updateDraftRes = await modifyDraft(draftDb,
        testDraftId, {...TestDraft, title: 'Test Draft 2',
          recipientType: 'someone else'});

    expect(updateDraftRes.success).to.equal(true);

    const getDraftRes = await getDraft(draftDb, testDraftId);
    expect(getDraftRes.success).to.equal(true);

    expect(getDraftRes.draft?.title).to.equal('Test Draft 2');
    expect(getDraftRes.draft?.recipientType).to.equal('someone else');
    expect(getDraftRes.draft?.userId).to.equal(TestDraft.userId);

    console.log(getDraftRes.draft);
  });

  it('Should get all drafts for a user', async () => {
    const draftDb = dbManager.getDraftDB();
    console.log(TestUser.id);
    const getDraftsRes = await getUserDrafts(draftDb, TestUser.id);
    expect(getDraftsRes.success).to.equal(true);
    expect(getDraftsRes.draftData?.drafts.length).to.equal(1);
    expect(getDraftsRes.draftData?.drafts[0].title).to.equal('Test Draft 2');
  });

  it('Should add a resource to a draft', async () => {
    const draftDb = dbManager.getDraftDB();
    const resource : any = {
      id: 'testResource',
      mimetype: 'image/jpeg',
    };
    const addResourceRes = await addResourceToDraft(
        draftDb, testDraftId, resource);
    expect(addResourceRes).to.be.undefined;

    const getDraftRes = await getDraft(draftDb, testDraftId);
    expect(getDraftRes.success).to.equal(true);
    expect(getDraftRes.draft?.resources).to.eql([resource]);
  });

  it('Should delete a resource from a draft', async () => {
    const draftDb = dbManager.getDraftDB();
    const deleteResourceRes = await deleteResourceFromDraft(
        draftDb, testDraftId, 'testResource');
    expect(deleteResourceRes).to.be.undefined;
    const getDraftRes = await getDraft(draftDb, testDraftId);
    expect(getDraftRes.success).to.equal(true);
    expect(getDraftRes.draft?.resources).to.be.empty;
  });

  it('Should delete a draft', async () => {
    const draftDb = dbManager.getDraftDB();
    const deleteDraftRes = await deleteDraft(draftDb, testDraftId);
    expect(deleteDraftRes.success).to.equal(true);

    const getDraftRes = await getDraft(draftDb, testDraftId);
    expect(getDraftRes.success).to.equal(false);
  });
});
