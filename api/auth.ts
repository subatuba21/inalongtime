import {Router} from 'express';
import {extractLoginInput,
  handleDeserializeError,
  passportAuthenticateLocal} from './middleware/auth';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post('/login', extractLoginInput,
    passportAuthenticateLocal, handleDeserializeError);

authRouter.use('/login', handleDeserializeError);

authRouter.get('/test', (req, res) => {
  res.end(JSON.stringify(req.user));
});
