import type {NextPageContext} from 'next';
import {useState, useEffect, createContext, useContext} from 'react';
// import {checkLogIn} from '../actions/LogIn';
import React from 'react';
import {useRouter} from 'next/router';
import {destroyCookie, parseCookies} from 'nookies';
import axios from 'axios';
import {useRecoilValue, useSetRecoilState} from 'recoil';
// import Image from 'next/image';

import {AddStateModal} from '../../components/state/add';
import {UpdateStateModal} from '../../components/state/update';
import {stateListState} from '../../states/stateList';
import {Layout} from '../../components/Layout';
import Footer from '../../components/Footer';
import {visitPageState} from '../../states/visitPage';

import styles from '../../styles/State.module.scss';

export const ModalContext = createContext({} as {
  modal: React.ReactNode
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode>>
});

const StateList = (props: any) => {
  // モーダル表示
  const [modal, setModal] = useState<React.ReactNode>(undefined);
  const route = useRouter();

  // 現在のページ取得
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setVisitPage(2);
  }, []);

  console.log(props);


  // ログアウト処理
  const logout = () => {
    destroyCookie(undefined, 'testAuthToken');
    route.push('/login');
  };


  return (
    <ModalContext.Provider value={{modal, setModal}}>
      <Layout>

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
      ADD
      </button>
    </>
  );
};


type checkResult = {
  check: boolean,
  data: any
}

const getCookie = (ctx?: NextPageContext) => {
  const cookie = parseCookies(ctx);
  return cookie;
};

export const getServerSideProps =
  async (context: NextPageContext) => {
    try {
      // cookieの取得
      const myCookie = getCookie(context);
      const headers = {
        headers: {
          Authorization: myCookie.testAuthToken,
        },
      };
      // console.log(headers);

      // state情報取得
      const check = await axios.get('http://ima-coco_nginx:80/api/state/', headers);
      const checkResult: checkResult = check.data;
      // console.log(checkResult.data);

      console.log('check', check);

      // if (checkResult?.check) {
      const list = checkResult.data;
      return {
        props: list,
      };
    } catch (err) {
      // console.log('--- index ---');
      console.log(err);
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  };

