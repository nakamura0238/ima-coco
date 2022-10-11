import type {NextPageContext} from 'next';
import {useState, useEffect} from 'react';
// import {checkLogIn} from '../actions/LogIn';
import React from 'react';
import {useRouter} from 'next/router';
import {destroyCookie, parseCookies} from 'nookies';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import Image from 'next/image';

import {AddStateModal} from '../../components/state/add';
import {UpdateStateModal} from '../../components/state/update';
import {stateListState} from '../../states/stateList';
import {Layout} from '../../components/Layout';
import {Footer} from '../../components/Footer';
import {visitPageState} from '../../states/visitPage';

import styles from '../../styles/State.module.scss';


const StateList = (props: any) => {
  // モーダル表示
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState<any>({});
  const route = useRouter();

  // 欲しいものリストの更新
  const setStateList = useSetRecoilState(stateListState);
  const stateList = useRecoilValue(stateListState);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setStateList(props.stateData);
    setVisitPage(2);
  }, []);

  // console.log(props);


  // ログアウト処理
  const logout = () => {
    destroyCookie(undefined, 'testAuthToken');
    route.push('/login');
  };

  // 登録モーダル
  const openAddModal = (): void => {
    setShowUpdateModal(false);
    setShowAddModal(true);
  };
  const closeAddModal = (): void => setShowAddModal(false);

  // 更新モーダル
  const openUpdateModal = (itemData: any): void => {
    setUpdateData(itemData);
    setShowAddModal(false);
    setShowUpdateModal(true);
  };
  const closeUpdateModal = (): void => setShowUpdateModal(false);


  return (
    <Layout>
      <button onClick={logout}
        tabIndex={showAddModal ? -1: undefined}>ログアウト</button>
      <button
        onClick={openAddModal}
        tabIndex={showAddModal ? -1: undefined}
        className={`${styles.addButton} ${styles.addPosition}`}>
        {/* <Image src={'/icon'}></Image> */}
        ADD
      </button>
      <div className={styles.itemContainer}>
        {stateList.map((val: any, i: number) => {
          if (val.common) {
            return (
              <div
                key={i}
                className={`${styles.item} ${styles.common}`}>
                <span>{val.state}</span>
                <span>Default</span>
              </div>
            );
          } else {
            return (
              <button
                key={i}
                onClick={() => openUpdateModal(val)}
                className={styles.item}>
                {val.state}
              </button>
            );
          }
        })}
      </div>

      {
        showAddModal ?
          <AddStateModal closeAction={closeAddModal} /> :
        undefined
      }
      {
        showUpdateModal?
        <UpdateStateModal
          closeAction={closeUpdateModal}
          itemData={updateData} /> :
        undefined
      }
      <Footer login={true}></Footer>
    </Layout>
  );
};

export default StateList;

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
      // console.log(headers);

      // state情報取得
      const check: checkResult = await axios.get('http://ima-coco_nginx:80/api/state/', headers);
      const checkResult = check.data;
      // console.log(checkResult.data);

      console.log('check', check);


      // if (checkResult?.check) {
      const list = checkResult.data;
      return {
        props: list,
      };
      // } else {
      //   // console.log('index else ');
      //   return {
      //     redirect: {
      //       permanent: false,
      //       destination: '/login',
      //     },
      //   };
      // }
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

