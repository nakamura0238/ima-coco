import axios from 'axios';
import {NextPageContext} from 'next';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {returnHeader} from '../../../actions/Cookie';
import Footer from '../../../components/Footer';
import {Layout} from '../../../components/Layout';

type roomInfo = {
  id?: number,
  roomName?: string,
  roomId?: string,
  message?: string,
  moveTo?: number,
}

type userData = {
  id: number,
  uid: string,
}

const Join = (props: any) => {
  const route = useRouter();

  const roomInfo: roomInfo = props.roomInfo;
  const userData: userData = props.userData;

  const joinRoom = async () => {
    try {
      const headers = returnHeader();
      const response =
        await axios.post(
            `http://localhost/api/room/join/${roomInfo.roomId}`,
            {},
            headers);

      const moveTo = response.data.joinRoomId;
      route.replace(`/room/${moveTo}`);
    } catch (err) {

    }
  };

  return (
    <Layout>
      <p>Join ページ</p>
      <p>ルームへの参加</p>

      {!roomInfo.message ?
        <>
          <h1>{roomInfo.roomName}</h1>
          <p>{route.query.roomId}</p>
          <button onClick={joinRoom}>参加する</button>
        </> :
        <>
          <h1>{roomInfo.message}</h1>
          {roomInfo.moveTo != 0 ?
            <Link href={`/room/${roomInfo.moveTo}`}>ルームへ移動する</Link> :
          undefined}
          <Link href={'/'}>トップへ戻る</Link>
        </>
      }
      <Footer login={true} />
    </Layout>
  );
};


/**
 * 未参加
 * 参加ずみ
 * 存在しないroom
 */
export default Join;


export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // const route = useRouter();
    const roomId = context.query.roomId;

    // cookieの取得
    const headers = returnHeader(context);
    console.log('in getServerSideProps: ', headers);

    const joinRoomInfo =
        await axios.get(`http://ima-coco_nginx:80/api/room/join/${roomId}`, headers);

    console.log(joinRoomInfo.data);

    return {
      props: {
        ...joinRoomInfo.data,
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
