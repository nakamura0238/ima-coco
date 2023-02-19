import axios from 'axios';
import {useRouter} from 'next/router';
import type {NextRouter} from 'next/router';
import QRCode from 'qrcode.react';
import React, {useState} from 'react';
import {returnHeader} from '../actions/Cookie';
import styles from '../styles/header.module.scss';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {generateApiLink} from '../actions/generateApiLink';


type props = {
  obj: propsObj,
}

type propsObj = {
  roomName: string,
  roomUnique: string,
}

const RoomHeader: React.FC<props> = ({obj}) => {
  const route = useRouter();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.btnBox}>
          <button
            onClick={() => {
              route.push('/room');
            }}><Image src={'/icon/arrow_left.svg'} width={24} height={24} />
          </button>
          <p>{obj.roomName}</p>
        </div>
        <ModalContainer roomUnique={obj.roomUnique} router={route}/>
      </nav>
    </header>
  );
};

export default RoomHeader;


type modalProps = {
  roomUnique: string,
  router: NextRouter,
}

const ModalContainer:React.FC<modalProps> = ({roomUnique, router}) => {
  const [modal, setModal] = useState<React.ReactNode>(undefined);

  const joinCloseAction = () => {
    setModal(undefined);
  };

  const copyJoinUrl = () => {
    const elm: HTMLInputElement =
      document.getElementById('JoinURL') as HTMLInputElement;
    const URL = elm?.value as string;
    console.log(URL);
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(URL).then(function() {
        toast.success('URLをコピーしました', {
          id: 'success copy',
          duration: 2000,
        });
      });
    } else {
      toast.error('コピーに失敗しました', {
        id: 'deny copy',
        duration: 2000,
      });
    }
  };

  const JoinModal: React.FC = () =>{
    const url = `localhost/room/join/${roomUnique}`;
    return (
      <>
        <div className={styles.leaveModal} onClick={joinCloseAction}>
          <div className={styles.leaveModalInner}
            onClick={(e) => e.stopPropagation()}>
            <p className={styles.headline}>ルーム参加用リンク</p>
            <input
              className={styles.invitationUrl}
              type="text"
              id="JoinURL"
              value={url}
              readOnly/>
            <button
              className={styles.invitationBtn}
              onClick={copyJoinUrl}>URLをコピー</button>
            <p className={styles.headline}>ルーム参加用QRコード</p>
            <QRCode value={url} />
            <button
              className={styles.modalCloseBtn}
              onClick={joinCloseAction}>
              <Image src={'/icon/cross.svg'} width={16} height={16}/>
            </button>
          </div>
        </div>
      </>
    );
  };


  const leaveCloseAction = () =>{
    setModal(undefined);
  };

  const LeaveModal: React.FC = () =>{
    const leaveRoom = async () => {
      try {
      // cookieの取得
        const headers = returnHeader();
        // ルームの情報を取得
        await axios.delete(
            generateApiLink(`/room/leave/${roomUnique}`),
            headers,
        );
        router.replace('/room');
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <div className={styles.leaveModal} onClick={leaveCloseAction}>
        <div className={styles.leaveModalInner}
          onClick={(e) => e.stopPropagation()}>
          <p className={styles.headlineRed}>ルームから退出します</p>
          <div className={styles.leaveBtnBox}>
            <button
              className={styles.cancelBtn}
              onClick={leaveCloseAction}>キャンセル</button>
            <button
              className={styles.leaveBtn}
              onClick={leaveRoom}>退出する</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.invLeave}>
        <button onClick={()=>setModal(<JoinModal/>)}>招待</button>
        <button onClick={() => setModal(<LeaveModal/>)}>退出</button>
      </div>
      {modal}
    </>
  );
};
