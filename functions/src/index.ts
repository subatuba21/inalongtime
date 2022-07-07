import {HttpFunction} from '@google-cloud/functions-framework';

export const helloWorld : HttpFunction = (req, res) => {
  return res.end('HELLO WORLD');
};
