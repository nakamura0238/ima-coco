import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {returnHeader} from '../../actions/Cookie';
import {socketUpdateState} from '../../lib/socket';
import Image from 'next/image';

import styles from '../../styles/inRoom.module.scss';

type userStates = {
  id: number,
  state: string,
  common: number,
}

type props = {
  userStates: userStates[],
  roomUnique: string,
}

// stateボタンリスト
const ShowStateButton: React.FC<props> = ({userStates, roomUnique}) => {
  const route = useRouter();
  const roomId = route.query.id;

  const [close, setClose] = useState(false);

  const updateState = async (stateDataId: number) => {
    const headers = returnHeader();

    // テキストボックスから値を取得
    const elm: HTMLInputElement = document.getElementById(
        'stateComment',
    ) as HTMLInputElement;
    const stateComment = elm.value;
    elm.value = '';

    // 更新時に使用するデータ
    const data = {
      stateDataId: stateDataId,
      roomId: roomId,
      roomUnique: roomUnique,
      stateComment: stateComment,
    };

    // ソケット処理
    socketUpdateState(data, headers, roomId as string);
  };

  return (
    <div className={styles.stateButtonContainer}>
      <div className={styles.stateButtonClose}>
        <button
          onClick={() => {
            setClose(!close);
          }}> <Image src={'/icon/arrow_down.svg'} width={16} height={16}
            className={`${close? styles.closing: undefined}`}/> </button>
      </div>
      <div className={
        `${styles.stateButtonBox} ${close ? styles.isClose: undefined}`
      }>
        <div className={styles.stateButtonList}>
          {userStates.map((val: any, i: any) => {
            return (
              <button
                className={styles.stateButton}
                key={i}
                onClick={() => updateState(val.id)}
              >
                {val.state}
              </button>
            );
          })}
        </div>
        <input
          className={styles.stateComment}
          id="stateComment"
          type="text"
          placeholder='コメント'/>
      </div>
    </div>
  );
};

export default ShowStateButton;
