import {Metadata} from '@google-cloud/storage/build/src/nodejs-common';
import express from 'express';
import {StatusCodes} from 'http-status-codes';
import logger from '../../../logger';
import {getDraftFile} from '../../../utils/contentStorage/draft';
import {UserSchema} from '../../../utils/schemas/user';
import {APIResponse} from '../../../utils/types/apiStructure';
export const getResource =
async (req: express.Request, res: express.Response, next: Function) => {
  const user = req.user as UserSchema;
  const draftId = req.draft?.id as string;
  const resourceId = req.resourceId as string;

  try {
    const headers : Record<string, string> = {
      'Cache-Control': 'max-age=604800',
    };
    const file =
      await getDraftFile(user._id, draftId, resourceId);

    const metadata : Metadata = (await file.getMetadata())[0];
    const contentType = metadata.contentType ?? 'undefined';
    headers['Content-Type'] = contentType;

    if (contentType.startsWith('video')) {
      const options : any = {};

      let start;
      let end;

      const range = req.headers.range;
      if (range) {
        const bytesPrefix = 'bytes=';
        if (range.startsWith(bytesPrefix)) {
          const bytesRange = range.substring(bytesPrefix.length);
          const parts = bytesRange.split('-');
          if (parts.length === 2) {
            const rangeStart = parts[0] && parts[0].trim();
            if (rangeStart && rangeStart.length > 0) {
              options.start = start = parseInt(rangeStart);
            }
            const rangeEnd = parts[1] && parts[1].trim();
            if (rangeEnd && rangeEnd.length > 0) {
              options.end = end = parseInt(rangeEnd);
            }
          }
        }
      }

      res.setHeader('content-type', contentType);

      const contentLength : number = parseInt(metadata.size);

      if (req.method === 'HEAD') {
        res.statusCode = 200;
        res.setHeader('accept-ranges', 'bytes');
        res.setHeader('content-length', contentLength);
        res.end();
        return;
      } else {
        let retrievedLength;
        if (start !== undefined && end !== undefined) {
          retrievedLength = (end+1) - start;
        } else if (start !== undefined) {
          retrievedLength = contentLength - start;
        } else if (end !== undefined) {
          retrievedLength = (end+1);
        } else {
          retrievedLength = contentLength;
        }

        // Listing 6.
        res.statusCode = start !== undefined || end !== undefined ? 206 : 200;
        res.setHeader('content-length', retrievedLength);

        if (range !== undefined) {
          res.setHeader('content-range',
              `bytes ${start || 0}-${end ||
                  (contentLength-1)}/${contentLength}`);
          res.setHeader('accept-ranges', 'bytes');
        }

        const fileStream = file.createReadStream(options);
        fileStream.on('error', (error) => {
          console.log(`Error reading file`);
          console.log(error);
          res.sendStatus(500);
        });
        fileStream.pipe(res);
      }
    } else {
      const stream = file.createReadStream();
      res.status(200).set(headers);
      stream.pipe(res);
    }
  } catch (err) {
    logger.error((err as any).message);
    const response : APIResponse = {
      error: {
        code: StatusCodes.NOT_FOUND,
        message: 'Unable to find resource',
      },
      data: null,
    };
    res.status(response?.error?.code as number).end(JSON.stringify(response));
  }
};
