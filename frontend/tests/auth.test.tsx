import {screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {LoginForm} from '../src/pages/loginPage/loginForm/loginForm';
import {store} from '../src/store/store';
import {rest} from 'msw';
import userEvent from '@testing-library/user-event';
import {renderWithProvider} from './provideRedux';
import {server} from './server';

describe('Auth integration tests', () => {
  const user = userEvent.setup();

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('Login feature', () => {
    test('Successful login', async () => {
      const loginSuccessful = rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({
          data: {
            email: 'test@gmail.com',
            firstName: 'Test',
            lastName: 'Test',
          },
          error: null,
        }));
      });

      server.use(loginSuccessful);

      const {container} = renderWithProvider(
          <LoginForm></LoginForm>);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Log In');

      const emailInput = await screen
          .findByPlaceholderText('Email') as HTMLInputElement;
      const passwordInput = await screen
          .findByPlaceholderText('Password') as HTMLInputElement;
      const submitButton =
        container.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await user.type(emailInput, 'test@gmail.com');
      await user.type(passwordInput, 'password');

      await user.click(submitButton);

      expect(store.getState().user.email).toStrictEqual('test@gmail.com');
      expect(store.getState().user.firstName).toStrictEqual('Test');
    });

    test('Faulty login', async () => {
      const loginFaulty = rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({
          data: null,
          error: {
            code: 401,
            message: 'incorrect username or password',
          },
        }));
      });

      server.use(loginFaulty);

      const {container} = renderWithProvider(
          <LoginForm></LoginForm>);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Log In');

      const emailInput = await screen
          .findByPlaceholderText('Email') as HTMLInputElement;
      const passwordInput = await screen
          .findByPlaceholderText('Password') as HTMLInputElement;
      const submitButton =
          container.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await user.type(emailInput, 'test@gmail.com');
      await user.type(passwordInput, 'password');

      await user.click(submitButton);

      expect(store.getState().user.email).toStrictEqual('test@gmail.com');
      expect(store.getState().user.firstName).toStrictEqual('Test');
    });
  });
});
