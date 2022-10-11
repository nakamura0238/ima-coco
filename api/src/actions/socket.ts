import {Server, Socket} from 'socket.io';
import {prisma} from '../config/db_connection';

export const socketManager = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // console.log('socket_ID: ', socket.id);

    socket.on('roomId', async (roomId: number) => {
      try {
      // socket.join();
        // console.log(roomId);

        const roomlist = await prisma.rooms.findMany({
          where: {
            id: Number(roomId),
          },
          select: {
            roomName: true,
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

        socket.emit('response', roomlist);
      } catch (err) {
        console.log(err);
      }
    });


    socket.on('room_join', async (obj) => {
      const rooms = [...socket.rooms].slice(0);
      if (rooms.length == 2) await socket.leave(rooms[1]);

      await socket.join(obj.room);

      // console.log('rooms : ', rooms);
      // console.log('rooms[1] : ', rooms[1]);

      io.to(obj.room).emit('room_res', obj.room);
    });


    socket.on('testMessage', (obj) => {
      // const rooms = [...socket.rooms].slice(0);
      // console.log('rooms : ', rooms);
      // console.log('rooms[1] : ', rooms[1]);
      io.to(obj.room).emit('testResponse', obj.message);
    });
  });

  io.on('disconnection', () => {});
};
