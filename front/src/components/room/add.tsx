import React from 'react';
import type {NextPageContext} from 'next';
import {parseCookies} from 'nookies';
import axios from 'axios';
import {generateApiLink} from '../../actions/generateApiLink';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import * as uuid from 'uuid';

import styles from '../../styles/AddModal.module.scss';
import {useRouter} from 'next/router';

type insertRomm = {
  roomName: string;
};

// バリデーション規則
const validate = yup.object({
  roomName: yup
      .string()
      .required('必須です'),
});

type props = {
  closeAction: () => void
}

export const AddRoomModal: React.FC<props> = ({closeAction}) => {
  const route = useRouter();

  // フォーム設定
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<insertRomm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(validate),
  });

  // 送信アクション
  const insertRoom: SubmitHandler<insertRomm> = async (data) => {
    try {
      const token = getCookie();
      const reqObject = {
        roomName: data.roomName,
        roomId: uuid.v4(),
      };
      const headers = {
        headers: {
          Authorization: token.testAuthToken,
        },
      };

      const result =
        await axios.post(generateApiLink('/api/room'), reqObject, headers);

      closeAction();
      reset();
      route.push(`/room/${result.data.roomId}`);
    } catch (err) {
      console.log(err);
    }
  };

  // Cookie取得
  const getCookie = (ctx?: NextPageContext) => {
    const cookie = parseCookies(ctx);
    return cookie;
  };


  return (
    <div className={styles.addWanted} onClick={closeAction}>
      <div className={styles.addWantedInner}
        onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(insertRoom)}>
          <input type="text"
            autoComplete="off"
            {...register('roomName')}/>
          <p>{errors.roomName?.message}</p>
          <button type="submit">登録</button>
        </form>
        <button onClick={closeAction}>閉じる</button>
      </div>
    </div>
  );
};


