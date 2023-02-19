import React, {useEffect, useState} from 'react';
import {createHash} from 'crypto';
import {useRouter} from 'next/router';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {useSetRecoilState} from 'recoil';
import {signupUserState} from '../states/signupUser';
import {NextPageContext} from 'next';
import {parseCookies, destroyCookie} from 'nookies';
import {checkLoggedIn} from '../actions/LoggedIn';
import {Layout} from '../components/Layout';
import Footer from '../components/Footer';
import {visitPageState} from '../states/visitPage';
import Image from 'next/image';

import styles from '../styles/signup.module.scss';
import axios from 'axios';
import {generateApiLink} from '../actions/generateApiLink';
import {toast} from 'react-hot-toast';

type Inputs = {
  uid: string,
  password: string,
};

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


const SignUp = () => {
  const route = useRouter();
  const setSignupUser = useSetRecoilState(signupUserState);
  const setVisitPage = useSetRecoilState(visitPageState);

  useEffect(() => {
    setSignupUser(undefined);
    setVisitPage(5);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<Inputs>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(validate),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const hash = createHash('sha256');
      hash.update(data.password);

      setSignupUser({
        uid: data.uid,
        password: data.password,
      });

      await axios.post(generateApiLink('/user/userCheck'), {uid: data.uid});

      route.push('/check');
      reset();
    } catch (err: any) {
      toast.error(err.response.data.errorMessage);
      // reset();
    }
  };


  return (
    <Layout>
      <h2 className={styles.pageTitle}>Signup</h2>

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
        <div className={styles.signupBtn}>
          <button className={styles.signupBtn} type="submit">登録</button>
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
      const token = parseCookies(context, 'testAuthToken');
      if (token) {
        const checkResult: any = await checkLoggedIn(context);

        console.log(checkResult);
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
      }
    } catch (err) {
      console.log(err);
    }
  };

export default SignUp;
