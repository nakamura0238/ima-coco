import React, {useContext, useEffect, useState} from 'react';
import {socket} from '../../lib/socket';

import styles from '../../styles/inRoom.module.scss';
import {UserContext} from '../../contexts/UserContext';


type state = {
  comment: string,
  state: string,
  uid: string,
  displayName: string | null,
}

type props = {
  stateListData: state[]
}

// stateリスト
const ShowStateList: React.FC<props> = ({stateListData}) => {
  const [stateList, setStateList] = useState(stateListData);
  const {user} = useContext(UserContext);

  console.log(user);
  if (user) {
    const UID = user.uid;
    // 並び替え処理
    const list = [...stateList];
    const myId = list.findIndex((element) =>
      element.uid === UID);
    const myState = list[myId];
    list.splice(myId, 1);
    list.unshift(myState);
    console.log(list);
  // 並び替え処理ここまで
  }

  useEffect(() => {
    socket.on('updateStateResponse', (data: state[]) => {
      if (user) {
        const UID = user.uid;
        // 並び替え処理
        const myId = data.findIndex((element) =>
          element.uid === UID);
        const myState = data[myId];
        data.splice(myId, 1);
        data.unshift(myState);
        console.log(data);
        // 並び替え処理ここまで
      }
      setStateList(data);
    });
  }, []);

  return (
    <div className={styles.stateListBox}>
      {stateList.map((val: any, i: number) => {
        return (
          <div className={styles.stateItem} key={i}>
            <p className={styles.name}>
              {val.displayName? val.displayName:val.uid}</p>
            <p className={styles.state}>{val.state}</p>
            <p className={styles.comment}>{val.comment}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShowStateList;
