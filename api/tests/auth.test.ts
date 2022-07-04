import {start} from '../../index';
import axios, {AxiosError} from 'axios';
import {StatusCodes} from 'http-status-codes';
import {getDb} from '../../db/setup';

const port = 2500;
const baseUrl = `http://localhost:${port}/api/auth`;

describe('API Tests for auth', () => {
  beforeAll(async () => {
    await start({
      port,
    });
  });

  describe('Testing register endpoint', () => {
    afterEach(async () => {
      const db = getDb();
      await db.collection('users').deleteMany({});
    });

    test('Testing invalid email', async () => {
      expect.assertions(1);
      try {
        await axios({
          url: `${baseUrl}/register`,
          method: 'POST',
          data: {
            data: {
              firstname: 'Subha',
              lastname: 'Das',
              email: 'huhuhu',
              password: '89839839839',
            },
          },
        });
      } catch (err) {
        const axerror = err as AxiosError;
        expect(axerror.response?.status)
            .toStrictEqual(StatusCodes.BAD_REQUEST);
      }
    });

    test('Testing invalid names', async () => {
      expect.assertions(1);
      try {
        await axios({
          url: `${baseUrl}/register`,
          method: 'POST',
          data: {
            data: {
              firstname: 'Su bha',
              lastname: 'Da s',
              email: 'sd7843@pleasantonusd.net',
              password: 'idhidhdih',
            },
          },
        });
      } catch (err) {
        const axerror = err as AxiosError;
        expect(axerror.response?.status)
            .toStrictEqual(StatusCodes.BAD_REQUEST);
      }
    });

    test('Testing invalid passwords', async () => {
      expect.assertions(1);
      try {
        await axios({
          url: `${baseUrl}/register`,
          method: 'POST',
          data: {
            data: {
              firstname: 'Subha',
              lastname: 'Das',
              email: 'sd7843@pleasantonusd.net',
              password: 'jsshs',
            },
          },
        });
      } catch (err) {
        const axerror = err as AxiosError;
        expect(axerror.response?.status)
            .toStrictEqual(StatusCodes.BAD_REQUEST);
      }
    });

    test('Should be successful', async () => {
      const res = await axios({
        url: `${baseUrl}/register`,
        method: 'POST',
        data: {
          data: {
            firstname: 'Joe',
            lastname: 'Bob',
            email: 'joebob@gmail.com',
            password: 'jsshjdjdjs',
          },
        },
      });
      expect(res.data.error).toBeNull();
      expect(res.data.data.firstname).toStrictEqual('Joe');
    });
  });

  describe('Testing login endpoint', () => {
    beforeEach(async () => {
      const db = getDb();
      await db.collection('users').deleteMany({});
    });

    test('Testing blank username and password', async () => {
      expect.assertions(1);
      try {
        await axios({
          url: `${baseUrl}/login`,
          method: 'POST',
          data: {
            data: {
              email: '',
              password: '',
            },
          },
        });
      } catch (err) {
        const axerror = err as AxiosError;
        expect(axerror.response?.status)
            .toStrictEqual(StatusCodes.UNAUTHORIZED);
      }
    });

    test('Should be successful', async () => {
      let res = await axios({
        url: `${baseUrl}/register`,
        method: 'POST',
        data: {
          data: {
            firstname: 'Joe',
            lastname: 'Bob',
            email: 'joebob@gmail.com',
            password: 'jsshjdjdjs',
          },
        },
      });
      expect(res.data.error).toBeNull();
      expect(res.data.data.firstname).toStrictEqual('Joe');

      res = await axios({
        url: `${baseUrl}/login`,
        method: 'POST',
        data: {
          data: {
            email: 'joebob@gmail.com',
            password: 'jsshjdjdjs',
          },
        },
      });

      expect(res.data.error).toBeNull();
      expect(res.data.data.firstname).toStrictEqual('Joe');
    });
  });
});
