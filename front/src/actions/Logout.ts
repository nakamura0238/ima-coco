import {NextRouter} from 'next/router';
import {destroyCookie} from 'nookies';

/**
 * ログアウト処理
 * @param {NextRouter} route
 */
export const logout = (route: NextRouter) => {
  destroyCookie(undefined, 'testAuthToken');
  route.push('/login');
};
