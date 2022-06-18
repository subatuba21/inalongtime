import express from 'express';
// eslint-disable-next-line max-len
export const serveReact = (req: express.Request, res: express.Response, next: Function) => {
  res.sendFile(__dirname + '/../frontend/build/index.html');
  res.end();
};
