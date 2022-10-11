import {NextPageContext} from 'next';
import {parseCookies} from 'nookies';
import axios from 'axios';

const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx);
  return cookie;
};

type Response = {
  check: boolean
  data: any
}

// ログイン状態のチェック
export const checkLogIn = async (context: NextPageContext) => {
  try {
    // cookieの取得
    const myCookie = getCookie(context);

    const data = {};
    const headers = {
      headers: {
        Authorization: myCookie.testAuthToken,
      },
    };

    const check:Response = await axios.post('http://ima-coco_nginx:80/api/user/check', data, headers);
    const checkResult = check.data.check;

    if (checkResult) {
      // データの返却
      return check.data;
    } else {
      // 認証失敗フラグの返却
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  } catch (err) {
    console.log('--- checklogin ---');
    console.log(err);
  }
};
