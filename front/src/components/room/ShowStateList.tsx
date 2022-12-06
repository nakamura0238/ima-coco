import React, {useEffect, useState} from 'react';
import {socket} from '../../lib/socket';

import styles from '../../styles/inRoom.module.scss';


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
  console.log('run showStateList');
  const [stateList, setStateList] = useState(stateListData);
  useEffect(() => {
    socket.on('updateStateResponse', (data) => {
      setStateList(data);
    });
  }, []);

  return (
    <div className={styles.stateListBox}>
      {stateList.map((val: any, i: number) => {
        return (
          <div className={styles.stateItem} key={i}>
            <p>username: {val.uid}</p>
            <p>{val.state}</p>
            <p>{val.comment}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShowStateList;
