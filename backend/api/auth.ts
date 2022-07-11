import {Router} from 'express';
import passport from 'passport';
import logger from '../logger';
import {
  passportAuthenticateLocal} from './middleware/login';
import {extractRegisterInput, registerUser} from './middleware/register';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.get('/login/google', () => logger.info('here'),
    passport.authenticate('google', {scope: ['profile']}));

authRouter.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
      res.redirect('/');
    });

authRouter.post('/login', passportAuthenticateLocal);
authRouter.post('/register', extractRegisterInput, registerUser);
