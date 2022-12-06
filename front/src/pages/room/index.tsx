import type {NextPageContext} from 'next';
import React, {useState, useEffect} from 'react';
// import {checkLogIn} from '../actions/LogIn';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {parseCookies} from 'nookies';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {AddRoomModal} from '../../components/room/add';
// import {UpdateWantedModal} from '../../components/state/update';
import {roomListState} from '../../states/roomList';
import {Layout} from '../../components/Layout';
import Footer from '../../components/Footer';
import {visitPageState} from '../../states/visitPage';
import {logout} from '../../actions/Logout';

import styles from '../../styles/Room.module.scss';

const RoomList = (props: any) => {
  // モーダル表示
  const [showAddModal, setShowAddModal] = useState(false);
  const route = useRouter();

  // ルームリストの更新
  const setWantedList = useSetRecoilState(roomListState);
  const roomList = useRecoilValue(roomListState);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setWantedList(props.rooms);
    setVisitPage(3);
  }, []);

  // console.log(props);

  // ログアウト処理
  // const logout = () => {
  //   destroyCookie(undefined, 'testAuthToken');
  //   route.push('/login');
  // };

  // 登録モーダル
  const openAddModal = (): void => {
    setShowAddModal(true);
  };
  const closeAddModal = (): void => setShowAddModal(false);

  // 更新モーダル
  const openUpdateModal = (itemData: any): void => {
    setShowAddModal(false);
  };

  return (
    <Layout>
      <button
        onClick={() => logout(route)}
        tabIndex={showAddModal ? -1 : undefined}
      >
        ログアウト
      </button>
      <button
        onClick={openAddModal}
        tabIndex={showAddModal ? -1 : undefined}
        className={`${styles.addButton} ${styles.addPosition}`}
      >
        ADD
      </button>
      <div className={styles.itemContainer}>
        {roomList.map((val: any, i: number) => {
          return (
            <Link key={i} href={`/room/${val.id}`}>
              <button
                onClick={() => openUpdateModal(val)}
                className={styles.item}
              >
                {val.roomName}
              </button>
            </Link>
          );
        })}
      </div>

      {showAddModal ? <AddRoomModal closeAction={closeAddModal} /> : undefined}

      <Footer login={true}></Footer>
    </Layout>
  );
};

export default RoomList;

type checkResult = {
  check: boolean;
  data: any;
};

const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx);
  return cookie;
};

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // cookieの取得
    const myCookie = getCookie(context);
    const headers = {
      headers: {
        Authorization: myCookie.testAuthToken,
      },
    };
    // console.log(headers);

    const check: checkResult = await axios.get(
        'http://ima-coco_nginx:80/api/room/',
        headers,
    );
    const checkResult = check.data;
    console.log(checkResult.data);

    if (checkResult?.check) {
      const list = checkResult.data;
      return {
        props: list,
      };
    } else {
      // console.log('index else ');
      return {
        redirect: {
          permanent: false,
          destination: '/login',
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
