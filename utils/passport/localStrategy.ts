import {Strategy} from 'passport-local';
import {getUserByEmail} from '../../db/auth';
import logger from '../../logger';
import {validatePassword} from '../validatePassword';

export const localStrategy = new Strategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email: string, password: string,
    done) => {
  logger.info(`Localstrategy working for email ${email}`);
  const userResponse = await getUserByEmail(email);
  if (!userResponse.success) {
    if (userResponse.error) {
      return done(userResponse.error, false);
    } else return done(null, false);
  } else if (userResponse.user?.passwordHash &&
    validatePassword(password, userResponse.user?.passwordHash)) {
    return done(null, userResponse.user);
  } else {
    return done(null, false);
  }
});
