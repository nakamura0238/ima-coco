import type {NextPageContext} from 'next';
import {useState, useEffect} from 'react';
import React from 'react';
import {useRouter} from 'next/router';
import {destroyCookie, parseCookies} from 'nookies';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {Layout} from '../../components/Layout';
import {Footer} from '../../components/Footer';
import {visitPageState} from '../../states/visitPage';
import {logout} from '../../actions/Logout';


const User = (props: any) => {
  const route = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setVisitPage(6);
  }, []);

  // ログアウト処理


  return (
    <Layout>

      <button onClick={() => logout(route)}
        tabIndex={showAddModal ? -1: undefined}>ログアウト</button>
      <p>ユーザーページ</p>

      <Footer login={true}></Footer>
    </Layout>
  );
};

export default User;

type checkResult = {
  check: boolean,
  data: any
}

const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx);
  return cookie;
};

export const getServerSideProps =
  async (context: NextPageContext) => {
    try {
      // cookieの取得
      const myCookie = getCookie(context);
      const headers = {
        headers: {
          Authorization: myCookie.testAuthToken,
        },
      };

      const check: checkResult = await axios.post('http://nginx:80/api/user/check', {}, headers);
      const checkResult = check.data;
      console.log(check);
      if (checkResult?.check) {
        return {
          props: {
            login: true,
          },
        };
      } else {
        return {
          props: {
            login: false,
          },
        };
      }
    } catch (err) {
      // console.log('--- index ---');
      console.log(err);
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  };

