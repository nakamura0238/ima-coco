import React, {ReactNode} from 'react';
import styles from '../styles/common.module.scss';

type Props = {
  children: ReactNode;
}

export const Layout = ({children, ...props}: Props) => {
  return (
    <div className={styles.container} {...props}>
      {children}
    </div>
  );
};
