import type {NextPageContext} from 'next';
import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {destroyCookie, parseCookies} from 'nookies';
import axios from 'axios';
import {Layout} from '../components/Layout';
import Footer from '../components/Footer';

import {visitPageState} from '../states/visitPage';
import {useSetRecoilState} from 'recoil';


const Home = (props: any) => {
  const route = useRouter();
  const login: boolean = props.login;

  const setVisitPage = useSetRecoilState(visitPageState);
  useEffect(() => {
    setVisitPage(1);
  });

  // ログアウト処理
  const logout = () => {
    destroyCookie(undefined, 'testAuthToken');
    route.push('/');
  };

  const executeSQL = async () => {
    const aaa = await axios.get('/api/room/aa/aa');
    console.log(aaa);
  };


  return (
    <Layout>
      <h1>TOPページ</h1>
      {login?
        <div>
          <button onClick={logout}>ログアウト</button>
          <button onClick={executeSQL}> SQL実行</button>
        </div>:
        undefined
      }

      <Footer login={login}></Footer>

    </Layout>
  );
};

export default Home;


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
      console.log(check);
      return {
        props: {
          login: true,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        props: {
          login: false,
        },
      };
    }
  };

