import axios from 'axios';
import {NextPageContext} from 'next';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {returnHeader} from '../../../actions/Cookie';
import Footer from '../../../components/Footer';
import {Layout} from '../../../components/Layout';
import styles from '../../../styles/Join.module.scss';
import {generateApiLink,
  generateServerApiLink} from '../../../actions/generateApiLink';

type roomInfo = {
  id?: number,
  roomName?: string,
  roomId?: string,
  message?: string,
  moveTo?: number,
}


const Join = (props: any) => {
  const route = useRouter();

  const roomInfo: roomInfo = props.roomInfo;
  console.log(props);

  const joinRoom = async () => {
    try {
      const headers = returnHeader();
      const response =
        await axios.post(
            generateApiLink(`/room/join/${roomInfo.roomId}`),
            {},
            headers);

      const moveTo = response.data.joinRoomId;
      route.replace(`/room/${moveTo}`);
    } catch (err) {

    }
  };

  return (
    <Layout>
      <p className={styles.pageTitle}>ルーム参加</p>

      <div className={styles.joinContainer}>
        <p className={styles.label}>ルーム名</p>
        <h1 className={styles.joinRoomName}>{roomInfo.roomName}</h1>
        {!roomInfo.message ?
          <div className={styles.joinBtn}>
            <button onClick={joinRoom}>参加する</button>
          </div>:
        <>
          <p className={styles.message}>{roomInfo.message}</p>
          {roomInfo.moveTo != 0 ?
          <div className={styles.moveRoom}>
            <Link href={`/room/${roomInfo.moveTo}`}>ルームへ移動する</Link>
          </div> :
          undefined}
        </>
        }
      </div>
      <Footer login={true} />
    </Layout>
  );
};


export default Join;

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roomId = context.query.roomId;

    // cookieの取得
    const headers = returnHeader(context);

    const joinRoomInfo =
        await axios.get(generateServerApiLink(`/room/join/${roomId}`), headers);

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
