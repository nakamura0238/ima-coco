import React, {useEffect} from 'react';
import {NextPageContext} from 'next';
import axios from 'axios';
import {Layout} from '../../../components/Layout';
import {socket} from '../../../lib/socket';
import ShowStateList from '../../../components/room/ShowStateList';
import {useRouter} from 'next/router';
import {generateServerApiLink} from '../../../actions/generateApiLink';

const display = (props: any) => {
  const route = useRouter();

  useEffect(() => {
    socket.emit('room_join', {room: route.query.roomId});
  }, []);

  return (
    <Layout>
      <ShowStateList stateListData={props.rooms} />
    </Layout>
  );
};

export default display;

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roomId = context.query.roomId;
    console.log(roomId);

    const joinRoomInfo =
        await axios.get(generateServerApiLink(`/room/display/${roomId}`));

    return {
      props: {
        ...joinRoomInfo.data.data,
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


/**
 * ルームIDを入力
 * データ取得、ソケット接続
 *
 */
