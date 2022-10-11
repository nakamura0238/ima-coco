import {atom} from 'recoil';

type Room = {
  id: string,
  room_name: string,
  room_id: string,
};

export const roomListState = atom<Room[]>({
  key: 'roomListState',
  default: [],
});
