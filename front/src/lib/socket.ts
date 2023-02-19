import io from 'socket.io-client';

const socketUrl = 'http://localhost';

export const socket = io(socketUrl, {
  withCredentials: true,
});

socket.on('room_res', (message) => {
  console.log('room_res: ', message);
});

socket.on('updateResponse', (data) => {
  console.log(data);
});

export const socketAction = (roomId: any) => {
  socket.emit('testMessage', {room: roomId, message: 'hi'});
};

// state更新リクエスト
export const socketUpdateState = (data: any, headers: any, roomId: string) => {
  socket.emit('updateStateRequest', {
    headers: headers.headers,
    data: data,
    roomId: roomId,
  });
};
