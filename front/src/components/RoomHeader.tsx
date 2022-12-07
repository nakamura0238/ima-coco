import axios from 'axios';
import {useRouter} from 'next/router';
import type {NextRouter} from 'next/router';
import QRCode from 'qrcode.react';
import React, {useState} from 'react';
import {returnHeader} from '../actions/Cookie';
import styles from '../styles/header.module.scss';


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
            }}>&lt;</button>
          <p>{obj.roomName}</p>
        </div>
        {/* <GenerateJoinUrl roomUnique={obj.roomUnique}/> */}
        <ModalContainer roomUnique={obj.roomUnique} router={route}/>
      </nav>
    </header>
  );
};

export default RoomHeader;

// type joinUrlProps= {
//   roomUnique: string
// }
// const GenerateJoinUrl: React.FC<joinUrlProps> = ({roomUnique}) => {
//   const [url, setUrl] = useState('');

//   const generateUrl = () => {
//     setUrl(`localhost/room/join/${roomUnique}`);
//   };
//   return (
//     <>
//       <p>{url}</p>
//       {url?
//         <QRCode
//           value={url} /> :
//         undefined}
//       <button onClick={generateUrl}>参加URL表示</button>
//     </>
//   );
// };


// type leaveModalProps = {
//   roomUnique: string,
//   router: NextRouter,
// }
// const LeaveModal: React.FC<leaveModalProps> = ({roomUnique, router}) => {
//   const [openModal, setOpenModal] = useState<boolean>(false);

//   // openModal
//   const openAction = () =>{
//     setOpenModal(true);
//   };

//   // closeModal
//   const closeAction = () =>{
//     setOpenModal(false);
//   };

//   const Modal: React.FC = () =>{
//     const leaveRoom = async () => {
//       try {
//       // cookieの取得
//         const headers = returnHeader();
//         // ルームの情報を取得
//         await axios.delete(
//             `http://localhost/api/room/leave/${roomUnique}`,
//             headers,
//         );
//         router.replace('/room');
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     return (
//       <div className={styles.leaveModal} onClick={closeAction}>
//         <div className={styles.leaveModalInner}
//           onClick={(e) => e.stopPropagation()}>
//           <p>ルームから退出します</p>
//           <button onClick={closeAction}>キャンセル</button>
//           <button onClick={leaveRoom}>OK</button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <button onClick={openAction}>退出</button>
//       {openModal?
//         <Modal />:
//         undefined
//       }
//     </>
//   );
// };

type modalProps = {
  roomUnique: string,
  router: NextRouter,
}

const ModalContainer:React.FC<modalProps> = ({roomUnique, router}) => {
  const [openJoinUrlModal, setOpenJoinUrlModal] = useState<boolean>(false);
  const [openLeaveModal, setOpenLeaveModal] = useState<boolean>(false);

  // openModal
  const joinOpenAction = () =>{
    setOpenJoinUrlModal(true);
    setOpenLeaveModal(false);
  };
  // closeModal
  const joinCloseAction = () =>{
    setOpenJoinUrlModal(false);
    setOpenLeaveModal(false);
  };

  const JoinModal: React.FC = () =>{
    const url = `localhost/room/join/${roomUnique}`;
    return (
      <div className={styles.leaveModal} onClick={joinCloseAction}>
        <div className={styles.leaveModalInner}
          onClick={(e) => e.stopPropagation()}>
          <p>ルーム参加用リンク</p>
          <p>{url}</p>
          <QRCode value={url} />
          <button onClick={joinCloseAction}>閉じる</button>
        </div>
      </div>
    );
  };


  // openModal
  const leaveOpenAction = () =>{
    setOpenLeaveModal(true);
    setOpenJoinUrlModal(false);
  };
    // closeModal
  const leaveCloseAction = () =>{
    setOpenLeaveModal(false);
    setOpenJoinUrlModal(false);
  };

  const LeaveModal: React.FC = () =>{
    const leaveRoom = async () => {
      try {
      // cookieの取得
        const headers = returnHeader();
        // ルームの情報を取得
        await axios.delete(
            `http://localhost/api/room/leave/${roomUnique}`,
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
          <p>ルームから退出します</p>
          <button onClick={leaveCloseAction}>キャンセル</button>
          <button onClick={leaveRoom}>OK</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <button onClick={joinOpenAction}>招待</button>
      {openJoinUrlModal?
        <JoinModal />:
        undefined
      }
      <button onClick={leaveOpenAction}>退出</button>
      {openLeaveModal?
        <LeaveModal />:
        undefined
      }
    </>
  );
};
