import fs from 'fs';
import path from 'path';
import {Future} from 'shared/dist/types/future';
import {compile} from 'handlebars';
import {transporter} from './setup';
import {formatDate} from 'shared/dist/utils/formatDate';

const futureViewedEmail = compile(fs.readFileSync(
    path.join(__dirname, './templates/futureViewed.hbs'), 'utf8'));

export const sendFutureViewedEmail =
    async (email: string, future: Future) => {
      let contentType : string = future.type;
      if (contentType === 'goals') {
        contentType = 'goals sheet';
      }

      const data = {...future, contentType, _id: future._id.toString(),
        createdAt: formatDate(future.createdAt)};
      const html = futureViewedEmail({
        ...data,
        hostAddress: process.env.HOST_ADDRESS,
      });


      const result = await transporter.sendMail({
        from: 'inalongtime',
        to: email,
        subject: `The ${data.contentType} you sent has been viewed`,
        html,
      });

      if (!result.accepted.includes(email)) {
        throw new Error('Email not accepted');
      }
    };
