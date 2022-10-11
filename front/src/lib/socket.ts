import io from 'socket.io-client';

export const socket = io('http://localhost', {
  withCredentials: true,
});

socket.on('room_res', (message) => {
  console.log('room_res: ', message);
});


socket.on('testResponse', (message) => {
  console.log('testResponse :', message);
});


export const socketAction = (roomId: any) => {
  socket.emit('testMessage', {room: roomId, message: 'hi'});
};
