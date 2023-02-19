import type {NextPageContext} from 'next';
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {AddRoomModal} from '../../components/room/add';
import {roomListState} from '../../states/roomList';
import {Layout} from '../../components/Layout';
import Footer from '../../components/Footer';
import {visitPageState} from '../../states/visitPage';

import styles from '../../styles/Room.module.scss';
import {returnHeader} from '../../actions/Cookie';
import {generateServerApiLink} from '../../actions/generateApiLink';

const RoomList = (props: any) => {
  // モーダル表示
  const [showAddModal, setShowAddModal] = useState(false);

  // ルームリストの更新
  const setWantedList = useSetRecoilState(roomListState);
  const roomList = useRecoilValue(roomListState);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setWantedList(props.rooms);
    setVisitPage(3);
  }, []);

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
      <p className={styles.headLine}>ルーム一覧</p>
      <button
        onClick={openAddModal}
        tabIndex={showAddModal ? -1 : undefined}
        className={`${styles.addButton} ${styles.addPosition}`}
      >
        ＋
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


export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const headers = returnHeader(context);

    const check: checkResult = await axios.get(
        generateServerApiLink('/room/'),
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
