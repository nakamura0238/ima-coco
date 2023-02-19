import {atom} from 'recoil';

/**
 * 0: none
 * 1: index
 * 2: state
 * 3: room
 * 4: login
 * 5: signup
 * 6: user
 */

type pageNum = 0 | 1| 2 |3 |4 |5 |6

export const visitPageState = atom<pageNum>({
  key: 'visitPageState',
  default: 0,
});
