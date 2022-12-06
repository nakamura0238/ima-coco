import {useRouter} from 'next/router';
import React from 'react';
import {returnHeader} from '../../actions/Cookie';
import {socketUpdateState} from '../../lib/socket';

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
  console.log('run showStateButton');
  const route = useRouter();
  const roomId = route.query.id;

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
      <div className={styles.stateButtonBox}>
        {userStates.map((val: any, i: any) => {
          return (
            <button
              className={styles.stateButton}
              key={i}
              onClick={() => updateState(val.id)}
            >
              {val.state}:{val.id}
            </button>
          );
        })}
      </div>
      <input id="stateComment" type="text" />
    </div>
  );
};

export default ShowStateButton;
