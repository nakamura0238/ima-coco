import io from 'socket.io-client';

export const socket = io('http://localhost', {
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
