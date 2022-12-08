import React, {useContext} from 'react';
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
import {ModalContext} from '../../pages/state';
// import {stateListState} from '../../states/stateList';

type insertState = {
  state: string;
};

// バリデーション規則
const validate = yup.object({
  state: yup
      .string()
      .required('必須です'),
});


export const AddStateModal: React.FC = () => {
  const {setModal} = useContext(ModalContext);

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
  const insertState: SubmitHandler<insertState> = async (data) => {
    const token = getCookie();
    const reqObject = {
      state: data.state,
    };
    const headers = {
      headers: {
        Authorization: token.testAuthToken,
      },
    };

    const result =
      await axios.post(generateApiLink('/api/state/'), reqObject, headers);
    // const resultData = result.data;
    // setPatienceList(resultData.patiences);
    // console.log(result);

    // state情報取得
    const check = await axios.get('http://localhost/api/state/', headers);
    const checkResult = check.data;
    console.log('insertState : ', checkResult);

    setStateList(checkResult.data.stateData);

    reset();
    closeAction();
  };

  // Cookie取得
  const getCookie = (ctx?: NextPageContext) => {
    const cookie = parseCookies(ctx);
    return cookie;
  };


  return (
    <div className={styles.addWanted} onClick={() => setModal(undefined)}>
      <div className={styles.addWantedInner}
        onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(insertState)}>
          <input type="text"
            autoComplete="off"
            {...register('state')}/>
          <p>{errors.state?.message}</p>
          <button type="submit">登録</button>
        </form>
        <button onClick={() => setModal(undefined)}>閉じる</button>
      </div>
    </div>
  );
};
