import express, {NextFunction, Request, Response} from 'express';
import {prisma} from '../config/db_connection';
import {auth} from '../middlewares/auth';
// import {SECRET_KEY} from '../config/keys';

// eslint-disable-next-line new-cap
export const roomRouter = express.Router();

// ルーム取得
roomRouter.get('/', auth, async (_req: Request, res: Response) => {
  try {
    const req = res.locals.userData;
    // console.log(req.uid);

    const rooms = await prisma.users.findMany({
      where: {
        uid: req.uid,
      },
      select: {
        uid: true,
        displayName: true,
        roomUser: {
          include: {
            rooms: {},
          },
        },
      },
    });

    // console.log(rooms[0].roomUser);

    const resRooms: Object[] = [];

    rooms[0].roomUser.map((val) => {
      const obj = {
        id: val.rooms.id,
        roomName: val.rooms.roomName,
        roomId: val.rooms.roomName,
        // comment: val.comment,
      };
      resRooms.push(obj);
    });

    // console.log(resRooms);

    return res.json({
      check: true,
      data: {
        rooms: resRooms,
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
roomRouter.post('/', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報

        const user = res.locals.userData; // ユーザー情報

        console.log('reqBody:', reqBody);
        console.log('user:', user);

        // ルームの作成
        const createRoom = await prisma.rooms.create({
          data: {
            roomName: reqBody.roomName,
            roomId: reqBody.roomId,
          },
        });

        console.log('createRoom:', createRoom);

        // // ルームとユーザーの関連付け
        const roomUserCreate = await prisma.room_user.create({
          data: {
            userId: user.id,
            roomId: Number(createRoom.id),
          },
        });

        console.log('roomUserCreate:', roomUserCreate);

        // stateの登録
        const defaultState = await prisma.states.create({
          data: {
            comment: null,
            roomUserId: roomUserCreate.id,
            stateDataId: 1,
          },
        });
        console.log(defaultState);

        res.send({roomId: createRoom.id});
      } catch (err) {
        next(err);
      }
    });

roomRouter.get('/:roomId', auth,
// auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const roomId = _req.params.roomId;
        const userData = res.locals.userData;
        console.log(roomId);
        console.log(res.locals.userData);


        const roomlist = await prisma.rooms.findMany({
          where: {
            id: Number(roomId),
          },
          select: {
            roomName: true,
            roomId: true,
            rooms: {
              select: {
                states: {
                  select: {
                    comment: true,
                    states: {
                      select: {
                        state: true,
                      },
                    },
                    roomUser: {
                      select: {
                        users: {
                          select: {
                            uid: true,
                            displayName: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        console.dir(roomlist[0], {depth: null});

        // オブジェクト整形

        const stateData = roomlist[0].rooms.map((val, i) => {
          return {
            comment: val.states[0].comment,
            state: val.states[0].states.state,
            uid: val.states[0].roomUser.users.uid,
            displayName: val.states[0].roomUser.users.displayName,
          };
        });

        const obj = {
          roomName: roomlist[0].roomName,
          roomId: roomlist[0].roomId,
          states: stateData,
        };

        console.dir(obj, {depth: null});

        // オブジェクト整形ここまで

        const states = await prisma.state_data.findMany({
          where: {
            OR: [
              {common: true},
              {userId: userData.id},
            ],
          },
          select: {
            id: true,
            state: true,
            common: true,
          },
        });

        res.json({
          rooms: roomlist,
          states: states,
          select: obj,
        });
      } catch {

      }
    });
