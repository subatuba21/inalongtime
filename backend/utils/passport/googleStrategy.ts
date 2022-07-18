import {Strategy} from 'passport-google-oauth2';
import {getUserByEmail, registerGoogleUser,
  UserDbResponse} from '../../db/auth';
import logger from '../../logger';

export const googleStrategy = new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL:
  // eslint-disable-next-line max-len
  `${process.env.GOOGLE_CALLBACK_URL_BASE as string}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  logger.verbose(`Localstrategy working for email ${profile.email}`);
  const userResponse: UserDbResponse = await getUserByEmail(profile.email);
  if (!userResponse.success) {
    if (profile.email) {
      const registerUserResponse = await registerGoogleUser({
        email: profile.email,
        firstname: profile.given_name,
        lastname: profile.family_name,
      });

      if (registerUserResponse.success) {
        return done(null, registerUserResponse.user);
      } else {
        return done(null, false);
      }
    } else {
      return done(null, false);
    }
  } else {
    if (userResponse?.user?.method==='google') {
      return done(null, userResponse.user);
    } else return done(null, false);
  }
});
