import React, {ReactNode} from 'react';
import styles from '../styles/common.module.scss';
import {Toaster} from 'react-hot-toast';

type Props = {
  children: ReactNode;
}

export const Layout = ({children, ...props}: Props) => {
  return (
    <div className={styles.container} {...props}>
      {children}
      <Toaster/>
    </div>
  );
};
