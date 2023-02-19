import {createContext} from 'react';

type userData = {
  id: number;
  uid: string;
};

// ユーザー情報context
export const UserContext = createContext({} as {
  user: userData | undefined,
});
