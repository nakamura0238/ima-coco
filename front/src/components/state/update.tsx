import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {generateApiLink} from '../../actions/generateApiLink';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import modalStyle from '../../styles/Modal.module.scss';
import {useSetRecoilState} from 'recoil';
import {stateListState} from '../../states/stateList';

import {ModalContext} from '../../contexts/ModalContext';
import {returnHeader} from '../../actions/Cookie';
import Link from 'next/link';
import Image from 'next/image';

type insertState = {
  state: string;
};

// バリデーション規則
const validate = yup.object({
  state: yup
      .string()
      .required('必須です'),
});

type props = {
  itemData: itemData,
}

type itemData = {
  id: number,
  state: string,
  common: boolean,
  busy: 0| 1,
}

type deleteId = {
  id: number,
  state: string
}


export const UpdateStateModal: React.FC<props> =
  ({itemData}) => {
    const {setModal} = useContext(ModalContext);

    const setStateList = useSetRecoilState(stateListState);

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
      (async () =>{
        // cookieの取得
        const headers = returnHeader();
        const res: any =
          await axios.get(
              generateApiLink(`/state/${itemData.id}`),
              headers);
        setRooms(res.data.stateData);
      })();
    }, []);

    // フォーム設定
    const {
      register,
      handleSubmit,
      reset,
      formState: {errors},
    } = useForm<insertState>({
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      criteriaMode: 'all',
      shouldFocusError: true,
      resolver: yupResolver(validate),
    });

    // 送信アクション
    const updateState: SubmitHandler<insertState> = async (data) => {
      const reqObject = {
        id: itemData.id,
        state: data.state,
      };
      const headers = returnHeader();

      await axios.put(generateApiLink('/state/'), reqObject, headers);

      // state情報取得
      const check = await axios.get(generateApiLink('/state/'), headers);
      const checkResult = check.data;
      // console.log('updateState : ', checkResult.data);

      setStateList(checkResult.data.stateData);

      reset();
      setModal(undefined);
    };

    const selectDeleteFunc = () => {
      reset();
      setModal(<DeleteStateModal id={itemData.id} state={itemData.state} />);
    };


    return (
      <div
        className={modalStyle.modalOverlay}
        onClick={() => setModal(undefined)}>
        <div
          className={modalStyle.modalInner}
          onClick={(e) => e.stopPropagation()}>
          <p className={modalStyle.modalHeadLine}>stateの更新</p>
          <form className={modalStyle.modalForm}
            onSubmit={handleSubmit(updateState)}>
            <input type="text"
              autoComplete="off"
              defaultValue={itemData.state}
              {...register('state')}/>
            <p>{errors.state?.message}</p>
            <button className={modalStyle.updateBtn} type="submit">更新</button>
          </form>
          {itemData.busy == 0?
            <button
              className={modalStyle.deleteText}
              onClick={selectDeleteFunc}>削除</button>:
            <div className={modalStyle.stateUseRoomContainer}>
              <p>使用中のルーム</p>
              <div className={modalStyle.stateUseRoomList}>
                {rooms.map((val: any, i: number) => {
                  return (
                    <Link
                      href={`/room/${val.id}`}
                      key={i}><a>{val.roomName}</a></Link>
                  );
                })}
              </div>
            </div>
          }
          <button
            className={modalStyle.modalCloseBtn}
            onClick={() => setModal(undefined)}>
            <Image src={'/icon/cross.svg'} width={16} height={16}/>
          </button>
        </div>
      </div>
    );
  };


export const DeleteStateModal: React.FC<deleteId> =
({id, state}) => {
  const {setModal} = useContext(ModalContext);
  const setStateList = useSetRecoilState(stateListState);

  const deleteFunc = async () => {
    const headers = returnHeader();
    await axios.delete(generateApiLink(`/state/${id}`), headers);

    // state情報取得
    const check = await axios.get(generateApiLink('/state'), headers);
    const checkResult = check.data;
    setStateList(checkResult.data.stateData);

    setModal(undefined);
  };

  return (
    <div
      className={modalStyle.modalOverlay}
      onClick={() => setModal(undefined)}>
      <div
        className={modalStyle.modalInner}
        onClick={(e) => e.stopPropagation()}>
        <p className={modalStyle.modalHeadLine}>stateを削除します</p>
        <p className={modalStyle.modalStateLabel}>{state}</p>
        <div className={modalStyle.stateDeleteBtnBox}>
          <button
            className={modalStyle.cancelBtn}
            onClick={() => setModal(undefined)}>キャンセル</button>
          <button
            className={modalStyle.deleteBtn}
            onClick={deleteFunc}>削除</button>
        </div>
        <button
          className={modalStyle.modalCloseBtn}
          onClick={() => setModal(undefined)}>×</button>
      </div>
    </div>
  );
};
