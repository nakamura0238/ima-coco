import React, {useEffect, useState} from 'react';
import {NextPageContext} from 'next';
import {setCookie, destroyCookie} from 'nookies';
import axios from 'axios';
import {createHash} from 'crypto';
import {useRouter} from 'next/router';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {checkLoggedIn} from '../actions/LoggedIn';
import {generateApiLink} from '../actions/generateApiLink';
import {Layout} from '../components/Layout';
import Footer from '../components/Footer';
import {useSetRecoilState} from 'recoil';
import {visitPageState} from '../states/visitPage';
import toast from 'react-hot-toast';
import Image from 'next/image';

import styles from '../styles/login.module.scss';

type Inputs = {
  uid: string;
  password: string;
};

type AuthLoginResponse = {
  check: boolean,
  message: string,
  token: string,
}

// バリデーション規則
const validate = yup.object({
  uid: yup
      .string()
      .required('必須です')
      .matches(
          /^([a-zA-Z0-9]){4,8}$/,
          '半角英数字4〜8文字で入力してください',
      ),
  password: yup
      .string()
      .required('必須です')
      .matches(
          /^([a-zA-Z0-9]){6,}$/,
          '半角英数字6文字以上で入力してください',
      ),
});

const LogIn = () => {
  const route = useRouter();

  const setVisitPage = useSetRecoilState(visitPageState);
  useEffect(() => {
    setVisitPage(4);
    // console.log(window.history);
  }, []);

  const {
    register,
    handleSubmit,
    // reset,
    formState: {errors},
  } = useForm<Inputs>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(validate),
  });

  // 送信処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const hash = createHash('sha256');
    hash.update(data.password);
    const pass = hash.digest('hex');

    const reqObject = {
      uid: data.uid,
      password: pass,
    };
    try {
      const result =
        await axios.post(generateApiLink('/user/login'), reqObject);
      const resultData: AuthLoginResponse = result.data;

      setCookie(undefined, 'testAuthToken', resultData.token, {
        maxAge: 7 * 24 * 60 * 60,
      } );
      route.push('/room');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errObj:any = err.response?.data;
        toast.error(errObj.errorMessage, {
          duration: 2000,
        });
      }
    }
  };

  return (
    <Layout>
      <h2 className={styles.pageTitle}>Login</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}>
        <p className={styles.headline}>ID</p>
        <input
          type={'text'}
          autoComplete="off"
          {...register('uid')}/>
        <p className={styles.errorMessage}>{errors.uid?.message}</p>

        <InputPass register={register('password')} errors={errors}/>
        <div className={styles.loginBtn}>
          <button type="submit">ログイン</button>
        </div>
      </form>
      <Footer login={false}></Footer>
    </Layout>
  );
};

const InputPass = (props: any) => {
  const {register, errors} = props;
  const [look, setLook] = useState(false);

  const lookPass = () => {
    const txtPass:HTMLInputElement =
      document.getElementById('textPass') as HTMLInputElement;
    if (txtPass!.type === 'text') {
      txtPass.type = 'password';
      setLook(false);
    } else {
      txtPass.type = 'text';
      setLook(true);
    }
  };

  return (
    <>
      <p className={styles.headline}>Password</p>
      <div className={styles.inputPass}>
        <input
          id="textPass"
          type={'password'}
          autoComplete="off"
          {...register}/>
        <span onClick={lookPass} className={styles.inputPassBtn}>
          <Image
            src={look ?'/icon/eye-slash-solid.svg': '/icon/eye-solid.svg'}
            width={20}
            height={20}
            objectFit={'contain'} />
        </span>
      </div>
      <p className={styles.errorMessage}>{errors.password?.message}</p>
    </>
  );
};


export const getServerSideProps =
  async (context: NextPageContext) => {
    try {
      const checkResult: any = await checkLoggedIn(context);

      if (checkResult?.check) {
        return {
          redirect: {
            permanent: false,
            destination: '/',
          },
        };
      } else {
        destroyCookie(context, 'testAuthToken');
        return {props: {}};
      }
    } catch (err) {
      console.log('--- login ---');
      console.log(err);
    }
  };

export default LogIn;
