import {Server, Socket} from 'socket.io';
// import {prisma} from '../config/db_connection';
import * as jwt from 'jsonwebtoken';
import {SECRET_KEY} from '../config/keys';

import * as mysql from 'mysql2/promise';
import {db} from '../config/db_connection';

export const socketManager = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // ルームへの参加
    socket.on('room_join', async (obj) => {
      const rooms = [...socket.rooms].slice(0);
      if (rooms.length == 2) await socket.leave(rooms[1]);

      await socket.join(obj.room);

      io.to(obj.room).emit('room_res', obj.room);
    });

    // 更新処理
    socket.on('updateStateRequest', async (obj) => {
      const token = obj.headers.Authorization;

      let user = null;
      if (token) {
        try {
          // トークンのデコード
          const tokenData: TokenPayload = jwt.verify(
              token,
              SECRET_KEY,
          ) as TokenPayload;
          const userData: UserToken = tokenData.user;
          // console.log('token: ', userData);

          const sql = 'CALL getUserData(?, ?);';
          const params = [userData.id, userData.uid];
          const [response] =
            await db.execute<mysql.RowDataPacket[][]>(sql, params);
          user = response[0][0];
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            console.error('トークンの有効期限が切れています。', err);
          } else if (err instanceof jwt.JsonWebTokenError) {
            console.error('トークンが不正です。', err);
          } else {
            console.error('トークンの検証でその他のエラーが発生しました。', err);
          }
          console.log(err);
        }
      }

      if (user) {
        const roomId = obj.data.roomId;
        const roomUnique = obj.data.roomUnique;
        const stateDataId = obj.data.stateDataId;
        const stateComment = obj.data.stateComment;
        const userId = user.id;

        const sql = 'CALL getUpdatedState(?, ?, ?, ?);';
        const params = [roomId, userId, stateDataId, stateComment];
        const [response] =
            await db.execute<mysql.RowDataPacket[][]>(sql, params);

        io.to(roomUnique).emit('updateStateResponse', response[0]);
      }
    });
  });

  io.on('disconnection', () => {
    console.log('disconnected');
  });
};

// 型定義
type TokenPayload = {
  user: UserToken;
};

type UserToken = {
  id: number;
  uid: string;
};
