import {Router} from 'express';
import {extractLoginInput,
  passportAuthenticateLocal} from './middleware/auth';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post('/login', extractLoginInput,
    passportAuthenticateLocal);

authRouter.get('/test', (req, res) => {
  res.end(JSON.stringify(req.user));
});
