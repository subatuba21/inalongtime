import {Router} from 'express';
import passport from 'passport';
import {extractNewPassword} from './middleware/forgotpassword';
import {
  logoutMiddleware,
  mustBeLoggedIn,
  passportAuthenticateLocal, returnCurrentUser} from './middleware/login';
import {extractRegisterInput, registerUser,
  verifyRecaptcha} from './middleware/register';


// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.get('/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));

authRouter.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
      res.redirect('/');
    });

authRouter.post('/logout', logoutMiddleware);
authRouter.get('/current', returnCurrentUser);
authRouter.post('/login', passportAuthenticateLocal);
authRouter.post('/register', extractRegisterInput,
    verifyRecaptcha, registerUser);
authRouter.post('/reset-password', mustBeLoggedIn, extractNewPassword);
