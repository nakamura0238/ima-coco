import React from 'react';
import axios from 'axios';
import {generateApiLink} from '../../actions/generateApiLink';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import * as uuid from 'uuid';

import modalStyle from '../../styles/Modal.module.scss';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {returnHeader} from '../../actions/Cookie';

type insertRoom = {
  roomName: string;
};

// バリデーション規則
const validate = yup.object({
  roomName: yup
      .string()
      .required('必須です')
      .max(20, '20文字以内で入力してください'),
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
  } = useForm<insertRoom>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(validate),
  });

  // 送信アクション
  const insertRoom: SubmitHandler<insertRoom> = async (data) => {
    try {
      // cookieの取得
      const headers = returnHeader();

      const reqObject = {
        roomName: data.roomName,
        roomId: uuid.v4(),
      };

      const result =
        await axios.post(generateApiLink('/room'), reqObject, headers);

      closeAction();
      reset();
      route.push(`/room/${result.data.roomId}`);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className={modalStyle.modalOverlay} onClick={closeAction}>
      <div className={modalStyle.modalInner}
        onClick={(e) => e.stopPropagation()}>
        <p className={modalStyle.modalHeadLine}>ルーム作成</p>
        <form
          className={modalStyle.modalForm}
          onSubmit={handleSubmit(insertRoom)}>
          <input type="text"
            autoComplete="off"
            placeholder='ルーム名'
            {...register('roomName')}/>
          <p>{errors.roomName?.message}</p>
          <button
            className={modalStyle.modalCloseBtn}
            type='button' onClick={closeAction}>
            <Image src={'/icon/cross.svg'} width={16} height={16}/></button>
          <button className={modalStyle.updateBtn} type="submit">登録</button>
        </form>
      </div>
    </div>
  );
};


