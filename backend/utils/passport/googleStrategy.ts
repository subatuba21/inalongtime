import {Strategy} from 'passport-google-oauth2';

export const googleStrategy = new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL:
  `${process.env.GOOGLE_CALLBACK_URL_BASE as string}/api/auth/google/callback`,
}, (accessToken, refreshToken, profile, cb) => {

});
