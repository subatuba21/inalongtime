import fs from 'fs';
import path from 'path';
import {Future} from 'shared/dist/types/future';
import {compile} from 'handlebars';
import {transporter} from './setup';

const futureEmail = compile(fs.readFileSync(
    path.join(__dirname, './templates/sendFuture.hbs'), 'utf8'));

export const sendFutureEmail =
    async (email: string, senderName: string, future: Future) => {
      let contentType : string = future.type;
      if (contentType === 'goals') {
        contentType = 'goals sheet';
      }

      const data = {...future, contentType};
      const html = futureEmail({
        data,
        hostAddress: process.env.HOST_ADDRESS,
      });


      const result = await transporter.sendMail({
        from: senderName,
        to: email,
        subject: `${senderName} sent you a ${data.contentType}`,
        html,
      });

      if (!result.accepted.includes(email)) {
        throw new Error('Email not accepted');
      }
    };
