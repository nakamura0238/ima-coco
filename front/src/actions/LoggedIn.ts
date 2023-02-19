import {NextPageContext} from 'next';
import axios from 'axios';
import {returnHeader} from './Cookie';
import {generateServerApiLink} from './generateApiLink';


type Response = {
  check: boolean
  data: any
}

// ログイン状態のチェック
export const checkLoggedIn = async (context: NextPageContext) => {
  try {
    // cookieの取得
    const headers = returnHeader(context);

    const data = {};

    const check:Response =
      await axios.post(
          generateServerApiLink('/user/loggedin'),
          data,
          headers);
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
    console.log(err);
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};
