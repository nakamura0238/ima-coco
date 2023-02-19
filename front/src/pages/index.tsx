import type {NextPageContext} from 'next';
import React, {useEffect} from 'react';
import axios from 'axios';
import {Layout} from '../components/Layout';
import Footer from '../components/Footer';

import {visitPageState} from '../states/visitPage';
import {useSetRecoilState} from 'recoil';
import {returnHeader} from '../actions/Cookie';
import {generateServerApiLink} from '../actions/generateApiLink';
import Image from 'next/image';
import styles from '../styles/Top.module.scss';


const Home = (props: any) => {
  const login: boolean = props.login;

  const setVisitPage = useSetRecoilState(visitPageState);
  useEffect(() => {
    setVisitPage(1);
  });

  return (
    <Layout>
      <div className={styles.background}>
        <div className={styles.logo}>
          <Image src={'/logo.svg'} width={400} height={104}/>
        </div>
      </div>
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

