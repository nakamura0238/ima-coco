import express, {NextFunction, Request, Response} from 'express';
// import {prisma} from '../config/db_connection';
import {auth} from '../middlewares/auth';
// import {SECRET_KEY} from '../config/keys';

import * as mysql from 'mysql2/promise';
import {db} from '../config/db_connection';

// eslint-disable-next-line new-cap
export const roomRouter = express.Router();

// ルーム一覧取得
roomRouter.get(
    '/',
    auth,
    async (_req: Request, res: Response) => {
      try {
        const req = res.locals.userData;
        // console.log(req);

        const sql = 'CALL getRoomList(?);';
        const params = [req.id];
        const [response] =
          await db.execute<mysql.RowDataPacket[][]>(sql, params);

        // console.log('aaaaaaaaaaa', response[0]);
        return res.json({
          check: true,
          data: {
            rooms: response[0],
          },
        });
      } catch (err) {
        console.log(err);
        return res.json({
          check: false,
        });
      }
    });

// ルーム追加
roomRouter.post(
    '/',
    auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報

        const user = res.locals.userData; // ユーザー情報

        // console.log('reqBody:', reqBody);
        // console.log('user:', user);


        const sql = 'CALL createRoom(?, ?, ?);';
        const params = [reqBody.roomName, reqBody.roomId, user.id];
        const [response] =
            await db.execute<mysql.RowDataPacket[][]>(sql, params);

        // console.log('aaaaaaaaaaa', response[0]);
        return res.send({roomId: response[0][0].createRoomId});
      } catch (err) {
        next(err);
      }
    },
);

// ルーム内情報取得
roomRouter.get(
    '/:roomId',
    auth,
    // auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const roomId = _req.params.roomId;
        const userData = res.locals.userData;

        const [checkRes] = await db.execute<mysql.RowDataPacket[][]>(
            'CALL checkJoinRoom(?, ?)',
            [roomId, userData.id],
        );

        // console.log('checkRes: ', checkRes[0]);

        // 該当ユーザーなし
        if (checkRes[0].length == 0) {
          return res.json({
            notJoin: true,
          });
        }

        const getInRoomInfo = async () => {
          const obj: any = {};
          const sqlParamSet = [
            {key: 'roomInfo',
              sql: 'CALL getRoomInfo(?)',
              params: [roomId]},
            {key: 'states',
              sql: 'CALL getStateList(?);',
              params: [roomId]},
            {key: 'userStates',
              sql: 'CALL getUserStateList(?)',
              params: [userData.id]},
          ];

          for (let i = 0; i < sqlParamSet.length; i++) {
            const [response] =
                await db.execute<mysql.RowDataPacket[][]>(
                    sqlParamSet[i].sql,
                    sqlParamSet[i].params);
            if (sqlParamSet[i].key == 'roomInfo') {
              obj[sqlParamSet[i].key] = response[0][0];
            } else {
              obj[sqlParamSet[i].key] = response[0];
            }
          }
          return obj;
        };

        const data = await getInRoomInfo();
        // console.log('*********************', {...data, userData: userData});

        res.json({
          ...data,
          userData: userData,
        });
      } catch {}
    },
);

// ルーム参加時情報取得
roomRouter.get(
    '/join/:roomId',
    auth,
    // auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      // console.log('getRoomJoin');
      try {
        const roomId = _req.params.roomId;
        const userData = res.locals.userData;


        const getJoinRoomInfo = async () => {
          const sql = 'CALL getJoinRoomInfo(?, ?)';
          const params = [roomId, userData.id];
          const [response] =
              await db.execute<mysql.RowDataPacket[][]>(sql, params);
          // console.log(response[0]);
          return response[0][0];
        };

        // console.log('roomId :', roomId);
        // console.log('userData :', userData.id);
        const data = await getJoinRoomInfo();
        // console.log('*********************', {...data, userData: userData});

        res.json({
          roomInfo: {...data},
          userData: userData,
        });
      } catch {}
    },

);

// ルーム参加処理
roomRouter.post(
    '/join/:roomId',
    auth,
    // auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const roomUnique = _req.params.roomId;
        const userData = res.locals.userData;
        // console.log(userData.id);

        const getJoinRoomInfo = async () => {
          const sql = 'CALL joinRoom(?, ?)';
          const params = [roomUnique, userData.id];
          const [response] =
            await db.execute<mysql.RowDataPacket[][]>(sql, params);

          return response[0][0];
        };

        const data = await getJoinRoomInfo();
        // console.log('*********************', {...data});


        res.json({
          ...data,
        });
      } catch (err) {
        console.log(err);
      }
    },


);

// ルーム退出
roomRouter.delete(
    '/leave/:roomId',
    auth,
    // auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const roomUnique = _req.params.roomId;
        const userData = res.locals.userData;
        // console.log(userData.id);

        // const getJoinRoomInfo = async () => {
        const sql = 'CALL leaveRoom(?, ?)';
        const params = [roomUnique, userData.id];
        // const [response] =
        await db.execute<mysql.RowDataPacket[][]>(sql, params);

        // return response[0][0];
        // };

        // const data = await getJoinRoomInfo();
        // console.log('*********************', {...data});


        res.json({
          message: '正常に処理が完了しました',
        });
      } catch (err) {
        console.log(err);
      }
    },


);


// roomRouter.get('/aa/aa', async (_req: Request, res: Response) => {
//   try {
//     const sql = 'CALL test();';
//     const [response] = await db.execute<mysql.RowDataPacket[][]>(sql);

//     console.log('aaaaaaaaaaa', response[0]);
//     res.send(response[0]);
//   } catch (err) {
//     console.log(err);
//   }
// });
