import {Router} from 'express';
import {extractLoginInput,
  passportAuthenticateLocal} from './middleware/login';
import {extractRegisterInput, registerUser} from './middleware/register';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post('/login', extractLoginInput,
    passportAuthenticateLocal);

authRouter.post('/register', extractRegisterInput, registerUser);
