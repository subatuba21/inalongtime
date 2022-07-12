import {Router} from 'express';
import passport from 'passport';
import {
  passportAuthenticateLocal, returnCurrentUser} from './middleware/login';
import {extractRegisterInput, registerUser} from './middleware/register';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.get('/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));

authRouter.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
      res.redirect('/');
    });

authRouter.get('/current', returnCurrentUser);
authRouter.post('/login', passportAuthenticateLocal);
authRouter.post('/register', extractRegisterInput, registerUser);
