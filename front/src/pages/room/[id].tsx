import React, {useEffect, useState} from 'react';
import {NextPageContext} from 'next';
import axios from 'axios';
import {useSetRecoilState} from 'recoil';

import {socket} from '../../lib/socket';
import {returnHeader} from '../../actions/Cookie';
import {Layout} from '../../components/Layout';
import RoomHeader from '../../components/RoomHeader';
import Footer from '../../components/Footer';
import ShowStateList from '../../components/room/ShowStateList';
import ShowStateButton from '../../components/room/ShowStateButton';
import {visitPageState} from '../../states/visitPage';
import {UserContext} from '../../contexts/UserContext';
import {generateServerApiLink} from '../../actions/generateApiLink';

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

type propsObj = {
  roomName: string,
  roomUnique: string,
}


const Room = (props: inRoomInfo) => {
  const roomInfo = props.roomInfo;
  const states = props.states;
  const userStates = props.userStates;
  // const id: number = roomInfo.id;
  const roomUnique = roomInfo.roomId;

  const headerProps: propsObj = {
    roomName: roomInfo.roomName,
    roomUnique: roomUnique,
  };

  const [user, setUser] = useState(props.userData);

  // 並び替え処理
  const UID = user.uid;
  const myId = states.findIndex((element) =>
    element.uid === UID);
  const myState = states[myId];
  states.splice(myId, 1);
  states.unshift(myState);
  // 並び替え処理ここまで

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    socket.emit('room_join', {room: roomUnique});
    setVisitPage(3);
  }, []);

  return (
    <UserContext.Provider value={{user}}>
      <Layout>
        <RoomHeader obj={headerProps}/>

        <ShowStateList stateListData={states} />
        <div>
          <ShowStateButton
            userStates={userStates}
            roomUnique={roomUnique} />
          <Footer login={true} />
        </div>
        <style jsx>{`
        div {
          position: sticky;
          bottom: 0;
        }
      `}</style>
      </Layout>
    </UserContext.Provider>
  );
};

export default Room;

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const id = context.query.id;

    // cookieの取得
    const headers = returnHeader(context);
    // ルームの情報を取得
    const roomInfo = await axios.get(
        generateServerApiLink(`/room/${id}`),
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
