import passport from 'passport';
import {getUser} from '../../db/auth';
import {localStrategy} from './localStrategy';

passport.use(localStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  const userResponse = await getUser(id);
  if (userResponse.success && userResponse.user) {
    return done(null, userResponse.user);
  } else if (!userResponse.success && userResponse.error) {
    return done(new Error(userResponse.error), null);
  } else {
    return done(new Error(
        `Unable to deserialize user with ID: ${id}. No error specified.`));
  }
});
