import {AxiosRequestConfig} from 'axios';
import {NextPageContext} from 'next/types';
import {parseCookies} from 'nookies';


/**
 * 認証情報を載せたheaderを返却する
 * @param {NextPageContext} context
 * @return {AxiosRequestConfig} headers
 */
export const returnHeader = (context?: NextPageContext) => {
  const cookie = parseCookies(context);
  const headers: AxiosRequestConfig = {
    headers: {
      Authorization: cookie.testAuthToken,
    },
  };

  return headers;
};
