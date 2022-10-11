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
import {Footer} from '../components/Footer';
import {visitPageState} from '../states/visitPage';
import Image from 'next/image';

import styles from '../styles/signup.module.scss';

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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const hash = createHash('sha256');
    hash.update(data.password);

    setSignupUser({
      uid: data.uid,
      password: data.password,
    });

    route.push('/check');
    reset();
  };


  return (
    <Layout>
      <h2>signupページ</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <p>ID</p>
        <input
          type={'text'}
          autoComplete="off"
          {...register('uid')}/>
        <p>{errors.uid?.message}</p>

        <InputPass register={register('password')}/>
        <p>{errors.password?.message}</p>
        <button type="submit">Submit</button>
      </form>
      <Footer login={false}></Footer>
    </Layout>
  );
};

const InputPass = (props: any) => {
  const {register} = props;
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
      <p>Password</p>
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
