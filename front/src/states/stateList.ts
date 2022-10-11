import {atom} from 'recoil';

type State = {
  state: string,
  common: boolean,
};

export const stateListState = atom<State[]>({
  key: 'stateListState',
  default: [],
});
