import React, {useState} from 'react';
import type {NextPageContext} from 'next';
import {parseCookies} from 'nookies';
import axios from 'axios';
import {generateApiLink} from '../../actions/generateApiLink';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useSetRecoilState} from 'recoil';

import styles from '../../styles/AddModal.module.scss';
import {roomListState} from '../../states/roomList';

type insertRoom = {
  title: string;
  price: string;
  comment: string;
};

// バリデーション規則
const validate = yup.object({
  title: yup
      .string()
      .required('必須です'),
  price: yup
      .string()
      .required('必須です'),
  comment: yup
      .string(),
});

type props = {
  closeAction: () => void
  itemData: itemData,
}

type itemData = {
  id: number,
  title: string,
  price: number,
  comment: string,
}

export const UpdatePatienceModal: React.FC<props> =
  ({closeAction, itemData}) => {
    const [selectDelete, setSelectDelete] = useState(false);
    const setRoomList = useSetRecoilState(roomListState);

    // フォーム設定
    const {
      register,
      handleSubmit,
      reset,
      formState: {errors},
    } = useForm<insertRoom>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      criteriaMode: 'all',
      shouldFocusError: true,
      resolver: yupResolver(validate),
    });

    // 送信アクション
    const insertPatience: SubmitHandler<insertRoom> = async (data) => {
      const token = getCookie();
      const reqObject = {
        id: itemData.id,
        title: data.title,
        price: data.price,
        comment: data.comment,
      };
      const headers = {
        headers: {
          Authorization: token.testAuthToken,
        },
      };

      const result =
      await axios.put(generateApiLink('/api/patience/'), reqObject, headers);
      const resultData = result.data;
      setRoomList(resultData.rooms);
      reset();
      closeAction();
    };

    // Cookie取得
    const getCookie = (ctx?: NextPageContext) => {
      const cookie = parseCookies(ctx);
      return cookie;
    };

    const selectDeleteFunc = () => {
      setSelectDelete(true);
    };

    const cancelDeleteFunc = () => {
      setSelectDelete(false);
    };

    const deleteFunc = async () => {
      const token = getCookie();
      const itemId = itemData.id;
      const headers = {
        headers: {
          Authorization: token.testAuthToken,
        },
      };

      const result =
      await axios.delete(generateApiLink(`/api/patience/${itemId}`), headers);
      const resultData = result.data;
      setRoomList(resultData.rooms);
      reset();
      closeAction();
    };

    return (
      <div className={styles.addWanted} onClick={closeAction}>
        <div className={styles.addWantedInner}
          onClick={(e) => e.stopPropagation()}>
          <p>id: {itemData.id}</p>
          <form onSubmit={handleSubmit(insertPatience)}>
            <input type="text"
              autoComplete="off"
              defaultValue={itemData.title}
              {...register('title')}/>
            <p>{errors.title?.message}</p>
            <input type="number"
              autoComplete="off"
              defaultValue={itemData.price}
              {...register('price')}/>
            <p>{errors.price?.message}</p>
            <input type="text"
              autoComplete="off"
              defaultValue={itemData.comment}
              {...register('comment')}/>
            <p>{errors.comment?.message}</p>
            <button type="submit">更新</button>
          </form>
          {selectDelete ?
          <div>
            <button onClick={cancelDeleteFunc}>キャンセル</button>
            <button onClick={deleteFunc}>削除</button>
          </div> :
          <button onClick={selectDeleteFunc}>削除</button>
          }
          <button onClick={closeAction}>閉じる</button>
        </div>
      </div>
    );
  };


// 使用中フラグを追加
// stateを使用中の場合削除できないようにする
