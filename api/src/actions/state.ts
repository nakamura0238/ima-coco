import express, {NextFunction, Request, Response} from 'express';
import {db} from '../config/db_connection';
import {auth} from '../middlewares/auth';
// import {SECRET_KEY} from '../config/keys';
import mysql from 'mysql2';

// eslint-disable-next-line new-cap
export const stateRouter = express.Router();

// state
stateRouter.get('/', auth, async (_req: Request, res: Response) => {
  try {
    const req = res.locals;
    // console.log('iiiiiiiiiiiiii: ', req.uid);
    const userData = req.userData;

    const [response] =
    await db.execute<mysql.RowDataPacket[][]>(
        'CALL getUserStateList(?)',
        [userData.id]);
    const states = response[0];

    // console.log('states', states);
    const resStates = states;

    return res.json({
      check: true,
      data: {
        stateData: resStates,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      check: false,
    });
  }
});

// state
stateRouter.post('/', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報
        const user = res.locals.userData; // ユーザー情報

        // console.log('reqBody:', reqBody);
        // console.log('user:', user);

        await db.execute<mysql.RowDataPacket[][]>(
            'CALL insertUserState(?, ?)',
            [reqBody.state, user.id],
        );

        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);

// state更新
stateRouter.put('/', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報
        const user = res.locals.userData; // ユーザー情報

        // console.log('reqBody:', reqBody);
        // console.log('user:', user);

        await db.execute<mysql.RowDataPacket[][]>(
            'CALL updateUserState(?, ?)',
            [reqBody.state, reqBody.id],
        );

        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);

// state削除
stateRouter.delete('/:id', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(_req.params.id);

        await db.execute<mysql.RowDataPacket[][]>(
            'CALL deleteUserState(?)',
            [id],
        );


        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);

// state使用ルーム取得
stateRouter.get('/:id', auth, async (_req: Request, res: Response) => {
  try {
    const id = Number(_req.params.id);

    const [response] =
    await db.execute<mysql.RowDataPacket[][]>(
        'CALL getStateUseRoom(?)',
        [id]);
    const rooms = response[0];

    const resRooms = rooms;

    return res.json({
      stateData: resRooms,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      check: false,
    });
  }
});
