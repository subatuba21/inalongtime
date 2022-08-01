import {transporter} from './setup';
import fs from 'fs';
import {compile} from 'handlebars';

const forgotPasswordEmail =
    compile(fs.readFileSync('./templates/forgotPassword.hbs', 'utf8'));

export const sendForgotPasswordEmail =
    async (email: string, token: string, id: string) => {
      const html = forgotPasswordEmail({
        token,
        id,
      });

      const result = await transporter.sendMail({
        from: 'contact@inalongtime.com',
        to: email,
        subject: 'Reset your password',
        html,
      });

      if (!result.accepted.includes(email)) {
        throw new Error('Email not accepted');
      }
    };
