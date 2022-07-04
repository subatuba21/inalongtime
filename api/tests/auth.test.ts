import {start} from '../../index';
import {StatusCodes} from 'http-status-codes';
import {getClient, getDb} from '../../db/setup';
import request from 'supertest';

const port = 3000;
let server : any;
let agent : request.SuperAgentTest;

describe('API Tests for auth', () => {
  beforeAll(async () => {
    server = await start({
      port,
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    const client = getClient();
    await client.close();
    await server.close();
  });

  describe('Testing register endpoint', () => {
    afterEach(async () => {
      const db = getDb();
      await db.collection('users').deleteMany({});
    });

    test('Testing invalid email', async () => {
      await agent.post('/api/auth/register')
          .send({
            data: {
              firstname: 'Joe',
              lastname: 'Joe',
              email: 'joejoe.net',
              password: 'idhidhdih',
            },
          })
          .expect(StatusCodes.BAD_REQUEST);
    });

    test('Testing invalid names', async () => {
      await agent.post('/api/auth/register')
          .send({
            data: {
              firstname: 'Jo e',
              lastname: 'Jo e',
              email: 'joe@joe.net',
              password: 'idhidhdih',
            },
          })
          .expect(StatusCodes.BAD_REQUEST);
    });

    test('Testing invalid passwords', async () => {
      await agent.post('/api/auth/register')
          .send({
            data: {
              firstname: 'Joe',
              lastname: 'Joe',
              email: 'joejoe.net',
              password: 'idhidhdih',
            },
          })
          .expect(StatusCodes.BAD_REQUEST);
    });

    test('Should be successful', async () => {
      await agent.post('/api/auth/register')
          .send({
            data: {
              firstname: 'Joe',
              lastname: 'Joe',
              email: 'joe@joe.net',
              password: 'idhidhdih',
            },
          })
          .expect(StatusCodes.OK);
    });
  });

  describe('Testing login endpoint', () => {
    beforeEach(async () => {
      const db = getDb();
      await db.collection('users').deleteMany({});
    });

    test('Testing blank username and password', async () => {
      await agent.post('/api/auth/login')
          .send({
            email: 'joejoe.net',
            password: 'idhidhdih',
          })
          .expect(StatusCodes.UNAUTHORIZED);
    });

    test('Should be successful', async () => {
      await agent.post('/api/auth/register')
          .send({
            data: {
              firstname: 'Joe',
              lastname: 'Joe',
              email: 'joebob@gmail.com',
              password: 'jsshjdjdjs',
            },
          })
          .expect(StatusCodes.OK);

      await agent.post('/api/auth/login')
          .send({
            email: 'joebob@gmail.com',
            password: 'jsshjdjdjs',
          })
          .expect(StatusCodes.OK);
    });
  });
});
