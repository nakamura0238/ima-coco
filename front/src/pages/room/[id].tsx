import React, {useEffect, useState} from 'react';
import {NextPageContext} from 'next';
import {Layout} from '../../components/Layout';
import {Footer} from '../../components/Footer';
import axios from 'axios';
import {useSetRecoilState} from 'recoil';
import {visitPageState} from '../../states/visitPage';

import {socket, socketAction} from '../../lib/socket';
import {returnHeader} from '../../actions/Cookie';

import styles from '../../styles/inRoom.module.scss';


const Room = (props: any) => {
  const rooms = props.list.rooms[0];
  const states = props.list.states;

  const obj = props.list.select;
  console.dir(obj);

  const id: number = props.id;
  // const data = props.data;
  const roomId = rooms.roomId;
  const [stateList, setStateList] = useState(rooms.rooms[0].states);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    socket.emit('room_join', {room: roomId});
    setVisitPage(3);
  }, []);

  socket.on('response', (roomData) => {
    setStateList(roomData[0].rooms[0].states);
  });

  return (
    <Layout>
      <p>ルームID：{id}</p>
      <h1 className={styles.roomName}>-- {rooms.roomName} --</h1>
      <button onClick={() => socketAction(roomId)}>
        ソケット通信
      </button>
      {/* {showStateList(stateList)} */}
      {showStateListSec(obj.states)}
      {showStateButton(states)}
      <Footer login={true}></Footer>
    </Layout>
  );
};

export default Room;

const showStateList = (list: any) => {
  return (
    <div className={styles.stateListBox}>
      {
        list.map((val: any, i:number) => {
          return (
            <div className={styles.stateItem} key={i}>
              <p>username: {val.roomUser.users.uid}</p>
              <p>{val.states.state}</p>
            </div>
          );
        })
      }
    </div>
  );
};

const showStateListSec = (list: any) => {
  return (
    <div className={styles.stateListBox}>
      {
        list.map((val: any, i:number) => {
          return (
            <div className={styles.stateItem} key={i}>
              <p>username: {val.uid}</p>
              <p>{val.state}</p>
            </div>
          );
        })
      }
    </div>
  );
};

const showStateButton = (states: any) => {
  return (
    <div className={styles.stateButtonContainer}>
      <div className={styles.stateButtonBox}>
        {states.map((val:any, i:any) => {
          return (
            <button className={styles.stateButton} key={i}>
              {val.state}
            </button>
          );
        })}
      </div>
      <input type="text" />
    </div>
  );
};


export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const id = context.query.id;

    // cookieの取得
    const headers = returnHeader(context);

    // ルームの情報を取得

    const check = await axios.get(`http://ima-coco_nginx:80/api/room/${id}`, headers);
    const checkResult = check.data;
    // console.log(checkResult);
    // console.log(checkResult.rooms[0].rooms[0].states);

    return {
      props: {
        id: id,
        data: 'ルーム' + id + 'の状態リスト',
        list: checkResult,
      },
    };
  } catch (err) {
    console.log(err);
  }
};


// ルームへのユーザー追加
/**
 * 全て招待制
 * ・QRコードからルームへ参加
 * ・URLで参加
 *    アクセス時にルーム追加画面に遷移、パラメーターをもとに参加するルームを表示
 *    ルームに参加情報をcookieに保存(有効時間は30mくらい？)
 *    ログインしている場合→参加orキャンセル キャンセルの場合cookieを削除
 *    ログインしていない場合→ログイン画面に遷移、ログイン後参加画面に遷移
 *    ユーザー登録していない場合→新規登録後、ログインしていない場合と同じ処理
 *
 * ルームIDは暗号化してパラメータにつける（可逆暗号）roomID
 *
 * QRコード、URLの表示はモーダルで行う
 * roomIDは暗号化し、roomID使用時には解号して使用する
 * keyは「NEXT_PUBLIC_ROOMID_KEY」
 *
 */
