import {createContext} from 'react';

export const ModalContext = createContext({} as {
  modal: React.ReactNode
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode>>
});
