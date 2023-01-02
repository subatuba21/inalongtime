import {Strategy} from 'passport-google-oauth2';
import {getUserByEmail, registerGoogleUser,
  UserDbResponse} from '../../db/auth';
import logger from '../../logger';
import {Request} from 'express';

export const onGoogleLogin = async (req: Request, accessToken: any,
    refreshToken: any, profile: any, done: any) => {
  logger.verbose(`Googlestrategy working for email ${profile.email}`);
  const userResponse: UserDbResponse = await getUserByEmail(
      req.dbManager.getUserDB(),
      profile.email);
  if (!userResponse.success) {
    if (profile.email) {
      const registerUserResponse = await registerGoogleUser(
          req.dbManager.getUserDB(), {
            email: profile.email,
            firstname: profile.given_name,
            lastname: profile.family_name,
          });

      if (registerUserResponse.success) {
        logger.verbose(`User ${profile.email} registered!`);
        return done(null, registerUserResponse.user);
      } else {
        logger.debug(`Googlestrategy error: ${registerUserResponse.error}`);
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
};

export const googleStrategy = new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  passReqToCallback: true,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL:
  // eslint-disable-next-line max-len
  `${process.env.HOST_ADDRESS as string}/api/auth/google/callback`,
}, onGoogleLogin);
