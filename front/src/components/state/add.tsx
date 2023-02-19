import React, {useContext} from 'react';
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
    const reqObject = {
      state: data.state,
    };
    const headers = returnHeader();

    await axios.post(generateApiLink('/state/'), reqObject, headers);

    // state情報取得
    const check = await axios.get(generateApiLink('/state/'), headers);
    const checkResult = check.data;

    setStateList(checkResult.data.stateData);

    reset();
    setModal(undefined);
  };


  return (
    <div
      className={modalStyle.modalOverlay}
      onClick={() => setModal(undefined)}>
      <div className={modalStyle.modalInner}
        onClick={(e) => e.stopPropagation()}>
        <p className={modalStyle.modalHeadLine}>stateの登録</p>
        <form
          className={modalStyle.modalForm}
          onSubmit={handleSubmit(insertState)}>
          <input type="text"
            autoComplete="off"
            {...register('state')}/>
          <p>{errors.state?.message}</p>
          <button className={modalStyle.updateBtn} type="submit">登録</button>
        </form>
        <button
          className={modalStyle.modalCloseBtn}
          onClick={() => setModal(undefined)}>
          <Image src={'/icon/cross.svg'} width={16} height={16}/></button>
      </div>
    </div>
  );
};
