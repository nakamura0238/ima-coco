import React, {useContext, useState} from 'react';
import type {NextPageContext} from 'next';
import {parseCookies} from 'nookies';
import axios from 'axios';
import {generateApiLink} from '../../actions/generateApiLink';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import {useSetRecoilState} from 'recoil';

import styles from '../../styles/AddModal.module.scss';
import {useSetRecoilState} from 'recoil';
import {stateListState} from '../../states/stateList';
// import {stateListState} from '../../states/stateList';

import {ModalContext} from '../../pages/state';

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

export const UpdateStateModal: React.FC<props> =
  ({itemData}) => {
    const {setModal} = useContext(ModalContext);

    const [selectDelete, setSelectDelete] = useState(false);
    const setStateList = useSetRecoilState(stateListState);

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
      const token = getCookie();
      const reqObject = {
        id: itemData.id,
        state: data.state,
      };
      const headers = {
        headers: {
          Authorization: token.testAuthToken,
        },
      };
      await axios.put('http://localhost/api/state/', reqObject, headers);

      // state情報取得
      const check = await axios.get('http://localhost/api/state/', headers);
      const checkResult = check.data;
      console.log('updateState : ', checkResult.data);

      setStateList(checkResult.data.stateData);

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
        await axios.delete(generateApiLink(`/api/state/${itemId}`), headers);

      // state情報取得
      const check = await axios.get('http://localhost/api/state/', headers);
      const checkResult = check.data;
      console.log('deleteFunc : ', checkResult);

      setStateList(checkResult.data.stateData);

      reset();
      setModal(undefined);
    };


    return (
      <div className={styles.addWanted} onClick={() => setModal(undefined)}>
        <div className={styles.addWantedInner}
          onClick={(e) => e.stopPropagation()}>
          <p>id: {itemData.id}</p>
          <form onSubmit={handleSubmit(updateState)}>
            <input type="text"
              autoComplete="off"
              defaultValue={itemData.state}
              {...register('state')}/>
            <p>{errors.state?.message}</p>
            <button type="submit">更新</button>
          </form>
          {itemData.busy == 0?
              (selectDelete ?
              <div>
                <button onClick={cancelDeleteFunc}>キャンセル</button>
                <button onClick={deleteFunc}>削除</button>
              </div> :
              <button onClick={selectDeleteFunc}>削除</button> ):
            <div>
              <button disabled>削除</button>
              <p>現在使用中です</p>
            </div>
          }
          <button onClick={() => setModal(undefined)}>閉じる</button>
        </div>
      </div>
    );
  };
