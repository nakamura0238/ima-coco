import React, {useEffect, useState} from 'react';
import {NextPageContext} from 'next';
import {Layout} from '../../components/Layout';
import Footer from '../../components/Footer';
import axios from 'axios';
import {useSetRecoilState} from 'recoil';
import {visitPageState} from '../../states/visitPage';

import {socket} from '../../lib/socket';
import {returnHeader} from '../../actions/Cookie';

import styles from '../../styles/inRoom.module.scss';

import ShowStateList from '../../components/room/ShowStateList';
import ShowStateButton from '../../components/room/ShowStateButton';

import QRCode from 'qrcode.react';
import {useRouter} from 'next/router';

type roomInfo = {
  id: number;
  roomName: string;
  roomId: string;
};
type state = {
  comment: string;
  state: string;
  uid: string;
  displayName: string | null;
};
type userStates = {
  id: number;
  state: string;
  common: number;
};
type userData = {
  id: number;
  uid: string;
};

type inRoomInfo = {
  roomInfo: roomInfo;
  states: state[];
  userStates: userStates[];
  userData: userData;
};

const Room = (props: inRoomInfo) => {
  console.log('run Room');
  const roomInfo = props.roomInfo;
  const states = props.states;
  const userStates = props.userStates;

  const id: number = roomInfo.id;
  const roomUnique = roomInfo.roomId;

  console.log('roomInfo', roomInfo);

  const route = useRouter();

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    socket.emit('room_join', {room: roomUnique});
    setVisitPage(3);
  }, []);


  // ルームから退出
  const leaveRoom = async () => {
    console.log('ルームから退出します');

    try {
    // cookieの取得
      const headers = returnHeader();
      // ルームの情報を取得
      await axios.delete(
          `http://localhost/api/room/leave/${roomUnique}`,
          headers,
      );
      route.replace('/room');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <p>ルームID：{id}</p>
      <button onClick={leaveRoom}>退出</button>
      <h1 className={styles.roomName}>-- {roomInfo.roomName} --</h1>
      <ShowStateList stateListData={states} />
      <GenerateJoinUrl roomId={roomUnique}/>
      <ShowStateButton
        userStates={userStates}
        roomUnique={roomUnique} />
      <Footer login={true} />
    </Layout>
  );
};

export default Room;

type joinUrlProps= {
  roomId: string
}
const GenerateJoinUrl: React.FC<joinUrlProps> = ({roomId}) => {
  const [url, setUrl] = useState('');

  const generateUrl = () => {
    setUrl(`localhost/room/join/${roomId}`);
  };
  return (
    <>
      <p>{url}</p>
      {url?
        <QRCode
          value={url} /> :
        undefined}
      <button onClick={generateUrl}>参加URL表示</button>
    </>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const id = context.query.id;

    // cookieの取得
    const headers = returnHeader(context);
    // ルームの情報を取得
    const roomInfo = await axios.get(
        `http://ima-coco_nginx:80/api/room/${id}`,
        headers,
    );
    const roomInfoData = roomInfo.data;

    // ルームに参加していない場合
    if (roomInfoData.notJoin) {
      return {
        redirect: {
          permanent: false,
          destination: '/room/',
        },
      };
    }

    return {
      props: {
        ...roomInfoData,
      },
    };
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
