import type {NextPageContext} from 'next';
import React, {useEffect} from 'react';
import axios from 'axios';
import {Layout} from '../components/Layout';
import Footer from '../components/Footer';

import {visitPageState} from '../states/visitPage';
import {useSetRecoilState} from 'recoil';
import {returnHeader} from '../actions/Cookie';
import {logout} from '../actions/Logout';
import {generateServerApiLink} from '../actions/generateApiLink';


const Home = (props: any) => {
  const login: boolean = props.login;

  const setVisitPage = useSetRecoilState(visitPageState);
  useEffect(() => {
    setVisitPage(1);
  });

  return (
    <Layout>
      <h1>TOPページ</h1>
      {login?
        <div>
          <button onClick={logout}>ログアウト</button>
        </div>:
        undefined
      }
      <br />
      <p>サービスの使用方法について</p>

      <Footer login={login}></Footer>

    </Layout>
  );
};

export default Home;

type checkResult = {
  check: boolean,
  data: any
}

export const getServerSideProps =
  async (context: NextPageContext) => {
    try {
      // cookieの取得
      const headers = returnHeader(context);

      const check: checkResult =
        await axios.post(
            generateServerApiLink('/user/check'),
            {},
            headers);
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

