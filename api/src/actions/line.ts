import express, {Request, Response} from 'express';
import axios from 'axios';

// import line from '@line/bot-sdk';
// import type {Message} from '@line/bot-sdk';

// eslint-disable-next-line new-cap
export const lineRouter = express.Router();

lineRouter.post('/', async (_req: Request, res: Response) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3500');
  const req = _req.body;

  const header = {
    headers: {
      // eslint-disable-next-line max-len
      Authorization: 'Bearer MyqONVbYl09rixB7+W/1BYb06ZR6rzUDL01v5T20RblWSZO5O0URxIrqx3BcOz7q8nMd/XGNr40g7yfNGKegBnuiIPz8UdMnvRrUwrmgJOel4LyeEAjovw5mUfsOhEwzx+WuuTmUX5ltKIzzko+e+gdB04t89/1O/w1cDnyilFU='},
  };

  const data = {
    'to': req.to,
    'messages': [
      {
        'type': 'text',
        'text': 'Hello, world',
      },
    ],
  };

  await axios.post('https://api.line.me/v2/bot/message/push', data, header);
  res.json({aaa: 'OK'});
});
