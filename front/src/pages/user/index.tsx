import React, {useState, useEffect, useContext} from 'react';
import type {NextPageContext} from 'next';
import Image from 'next/image';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useForm, SubmitHandler} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import {logout} from '../../actions/Logout';
import {returnHeader} from '../../actions/Cookie';
import {AddStateModal} from '../../components/state/add';
import {UpdateStateModal} from '../../components/state/update';
import {Layout} from '../../components/Layout';
import Footer from '../../components/Footer';
import {stateListState} from '../../states/stateList';
import {visitPageState} from '../../states/visitPage';

import styles from '../../styles/State.module.scss';
import userStyles from '../../styles/User.module.scss';
import {ModalContext} from '../../contexts/ModalContext';
import {generateApiLink,
  generateServerApiLink} from '../../actions/generateApiLink';

type updateName = {
  displayName: string;
};

// バリデーション規則
const validate = yup.object({
  displayName: yup
      .string(),
});

const StateList = (props: any) => {
  // user props
  const [user, setUser] = useState(props.user);

  // モーダル表示
  const [modal, setModal] = useState<React.ReactNode>(undefined);

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setVisitPage(2);
  }, []);


  // フォーム設定
  const {
    register,
    handleSubmit,
  } = useForm<updateName>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(validate),
  });

  // 送信アクション
  const updateDisplayName: SubmitHandler<updateName> = async (data) => {
    const reqObject = {
      displayName: data.displayName,
    };
    const headers = returnHeader();

    const result =
      await axios.post(
          generateApiLink('/user/displayName'),
          reqObject,
          headers);
    const resultData = result.data;

    setUser(resultData);
    toast.success('表示名を変更しました', {
      id: 'change name',
      duration: 2000,
    });
  };


  return (
    <ModalContext.Provider value={{modal, setModal}}>
      <Layout>
        <div className={userStyles.withLogout}>
          <p className={userStyles.headLineWithLogout}>ユーザー情報</p>
          <button onClick={logout}>
            <Image src={'/icon/logout.svg'} width={24} height={24}/>
          </button>
        </div>
        <form
          className={userStyles.form}
          onSubmit={handleSubmit(updateDisplayName)}>
          <div className={userStyles.formInnerBox}>
            <p className={userStyles.inFormHeadLine}>ユーザーID</p>
            <p className={userStyles.value}>{user.uid}</p>
          </div>
          <div className={userStyles.formInnerBox}>
            <p className={userStyles.inFormHeadLine}>表示名</p>
            <div className={userStyles.inputBox}>
              <input defaultValue={user.displayName}
                autoComplete='OFF'
                {...register('displayName')}/>
              <button>更新</button>
            </div>
          </div>
        </form>
        <p className={userStyles.headLine}>state情報</p>
        <UpdateStateModalContainer stateData={props.stateData}/>
        <AddStateModalContainer/>

        <Footer login={true}></Footer>
        {modal}
      </Layout>
    </ModalContext.Provider>
  );
};

export default StateList;

type updateStateProps = {
  stateData: any
}
const UpdateStateModalContainer: React.FC<updateStateProps> = ({stateData}) => {
  const {setModal} = useContext(ModalContext);

  const setStateList = useSetRecoilState(stateListState);
  const stateList = useRecoilValue(stateListState);

  useEffect(() => {
    setStateList(stateData);
  }, []);

  // 登録モーダル
  const openUpdateModal = (val:any) => {
    setModal(<UpdateStateModal itemData={val} />);
  };

  return (
    <>
      <div className={styles.itemContainer}>
        {stateList.map((val: any, i: number) => {
          return (
            <button
              key={i}
              onClick={() => openUpdateModal(val)}
              className={styles.item}>
              {val.state}
              {val.busy == 1 ?
                <span>使用中</span>:
                undefined}
            </button>
          );
        })}
      </div>
    </>
  );
};

const AddStateModalContainer: React.FC = () => {
  const {setModal} = useContext(ModalContext);

  // 登録モーダル
  const openAddModal = () => {
    setModal(<AddStateModal />);
  };

  return (
    <>
      <button
        onClick={openAddModal}
        className={`${styles.addButton} ${styles.addPosition}`}>
      ＋
      </button>
    </>
  );
};


type checkResult = {
  check: boolean,
  data: any
}

export const getServerSideProps =
  async (context: NextPageContext) => {
    try {
      // cookieの取得
      const headers = returnHeader(context);

      // state情報取得
      const check =
        await axios.get(
            generateServerApiLink('/state/'),
            headers);
      const checkResult: checkResult = check.data;

      const userRes: any =
        await axios.get(
            generateServerApiLink('/user/info'),
            headers);

      return {
        props: {
          stateData: checkResult.data.stateData,
          user: {...userRes.data},
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  };

