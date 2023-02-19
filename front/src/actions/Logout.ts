import Router from 'next/router';
import {destroyCookie} from 'nookies';

/**
 * ログアウト処理
 */
export const logout = () => {
  destroyCookie(undefined, 'testAuthToken');
  Router.push('/login');
};
