import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useRecoilValue} from 'recoil';
import axios from 'axios';
import {createHash} from 'crypto';
import {signupUserState} from '../states/signupUser';
import {generateApiLink} from '../actions/generateApiLink';
import {Layout} from '../components/Layout';
import styles from '../styles/Check.module.scss';

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
        await axios.post(generateApiLink('/user/signup'), userData);
      console.log(res);
      route.replace('/login');
    }
  };

  return (
    <Layout>
      {
        signupUser?
          <>
            <p className={styles.headLine}>登録情報確認</p>
            <div className={styles.userInfoBox}>
              <div>
                <p className={styles.userInfoHeadLine}>ユーザーID</p>
                <p className={styles.userInfoValue}>{signupUser.uid}</p>
              </div>
              <div>
                <p className={styles.userInfoHeadLine}>パスワード</p>
                <p className={styles.userInfoValue}>{signupUser.password}</p>
              </div>
            </div>
            <p className={styles.description}>
              スクリーンショットなどでパスワードをお控えください</p>
            <div className={styles.btnBox}>
              <Link href="/signup">
                <a className={styles.cancelBtn}>
                戻る
                </a>
              </Link>
              <button
                className={styles.registerBtn}
                onClick={submitUserData}>
                  登録
              </button>

            </div>
          </> :
        undefined
      }
    </Layout>
  );
};

export default Check;
