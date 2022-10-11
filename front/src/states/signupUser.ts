import {atom} from 'recoil';

type Inputs = {
  uid: string;
  password: string;
};

export const signupUserState = atom<undefined | null | Inputs>({
  key: 'signupUser',
  default: undefined,
});
