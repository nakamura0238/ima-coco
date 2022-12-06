import Link from 'next/link';
import React from 'react';
import styles from '../styles/footer.module.scss';
import {visitPageState} from '../states/visitPage';

import {useRecoilValue} from 'recoil';

type props = {
  login: boolean,
}

type buttonType = {
  path: string,
  label: string
  pageNum: number
}

const Footer: React.FC<props> = ({login}) => {
  const visitPage = useRecoilValue(visitPageState);

  const buttonLogin: buttonType[] = [
    {
      path: '/room',
      label: 'room',
      pageNum: 3,
    },
    {
      path: '/state',
      label: 'state',
      pageNum: 2,
    },
    {
      path: '/user',
      label: 'user',
      pageNum: 6,
    },
    {
      path: '/',
      label: 'TOP',
      pageNum: 1,
    },
  ];

  const buttonLogout: buttonType[] = [
    {
      path: '/login',
      label: 'ログイン',
      pageNum: 4,
    },
    {
      path: '/signup',
      label: 'サインアップ',
      pageNum: 5,
    },
    {
      path: '/',
      label: 'TOP',
      pageNum: 1,
    },
  ];

  type btnProps = {
    btnVal: buttonType,
  }

  const NavButton: React.FC<btnProps> = ({btnVal}) => {
    return (
      <>
        <Link href={btnVal.path} passHref>
          <button className={`
              ${btnVal.pageNum != visitPage?
                undefined:
                styles.selected }
              ${styles.navButton} 
              ${login? styles.navLogin : styles.navLogout}
              `}>
            {btnVal.label}
          </button>
        </Link>
      </>
    );
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        {login?
          <>
            {buttonLogin.map((val, i) => <NavButton btnVal={val} key={i}/>)}
          </>:
          <>
            {buttonLogout.map((val, i) => <NavButton btnVal={val} key={i}/>)}
          </>
        }
      </nav>
    </footer>
  );
};

export default Footer;
