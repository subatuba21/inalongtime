import {Router} from 'express';
import {
  passportAuthenticateLocal} from './middleware/login';
import {extractRegisterInput, registerUser} from './middleware/register';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post('/login', passportAuthenticateLocal);
authRouter.post('/register', extractRegisterInput, registerUser);
