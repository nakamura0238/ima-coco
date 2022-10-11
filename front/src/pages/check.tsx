import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {signupUserState} from '../states/signupUser';
import axios from 'axios';
import {createHash} from 'crypto';
import {generateApiLink} from '../actions/generateApiLink';
import {Layout} from '../components/Layout';

const Check = () => {
  const route = useRouter();
  const signupUser = useRecoilValue(signupUserState);
  console.log(signupUser);

  useEffect(() => {
    // データがない場合はサインアップ画面
    if (!signupUser) {
      route.push('/signup');
    }
  }, [route]);

  const submitUserData = async () => {
    if (signupUser) {
      const hash = createHash('sha256');
      hash.update(signupUser.password);

      const userData = {
        uid: signupUser.uid,
        password: hash.digest('hex'),
      };

      const res =
        await axios.post(generateApiLink('/api/user/signup'), userData);
      console.log(res);
      route.replace('/login');
    }
  };

  return (
    <Layout>
      {
        signupUser?
          <>
            <p>情報確認ページ</p>
            <p>{signupUser.uid}</p>
            <p>{signupUser.password}</p>
            <p>スクリーンショットなどでパスワードをお控えください</p>
            <Link href="/signup">
              戻る
            </Link>
            <button onClick={submitUserData}>登録</button>
          </> :
        undefined
      }

    </Layout>
  );
};

export default Check;
