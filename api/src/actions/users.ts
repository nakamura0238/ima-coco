import express, {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {db} from '../config/db_connection';
import {auth} from '../middlewares/auth';
import {SECRET_KEY} from '../config/keys';

import mysql from 'mysql2';

// eslint-disable-next-line new-cap
export const userRouter = express.Router();

userRouter.post('/loggedin', auth, async (_req: Request, res: Response) => {
  try {
    return res.json({
      check: true,
    });
  } catch (err) {
    console.log(err);
  }
});

// ログインチェック
userRouter.post('/check', auth, async (_req: Request, res: Response) => {
  // console.log('check');
  try {
    return res.json({
      data: {
        message: 'ログイン中です',
      },
    });
  } catch (err) {
    console.log(err);
    res.status(403).send('ログインしていません');
  }
});

// サインアップ
userRouter.post('/signup', async (_req: Request, res: Response) => {
  try {
    const req = _req.body;

    const [row] =
        await db.execute<mysql.RowDataPacket[][]>(
            'CALL registeredUser(?);',
            [req.uid]);
    // console.log('registeredUser: ', row[0]);
    const check = row[0][0];

    // ユーザー未登録の確認
    if (!check) {
      // ユーザー未登録の時の処理
      await db.execute<mysql.RowDataPacket[][]>(
          'CALL signupUser(?, ?);',
          [req.uid, req.password]);

      return res.json({
        check: true,
        message: 'success',
        body: null,
      });
    } else {
      // ユーザー登録済の時の処理
      return res.json({
        check: false,
        message: 'このユーザー名はすでに登録されています',
        body: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// サインイン
type AuthLoginResponse = {
  check: boolean,
  message: string,
  token: string,
}

userRouter.post('/login', async (_req: Request, res: Response) => {
  const req = _req.body;

  const [row] =
  await db.execute<mysql.RowDataPacket[][]>(
      'CALL registeredUser(?);',
      [req.uid]);
  // console.log('registeredUser: ', row[0]);
  const check = row[0][0];


  // ユーザー登録のチェック
  if (check) {
    const [row] =
    await db.execute<mysql.RowDataPacket[][]>(
        'CALL loginUser(?, ?);',
        [req.uid, req.password]);
    const userData = row[0][0];

    // ユーザーの認証
    if (userData) {
      const payload = {
        user: {
          id: userData.id,
          uid: userData.uid,
        },
      };
      const option = {
        expiresIn: '7days',
      };
      const token = jwt.sign(payload, SECRET_KEY, option);
      const resData: AuthLoginResponse = {
        check: true,
        message: 'success',
        token: token,
      };
      return res.send(resData);
    } else {
      // パスワード不一致
      res.status(403).send({errorMessage: 'パスワードが間違っています'});
    }
  } else {
    // ユーザー未登録
    res.status(403).send({errorMessage: 'ユーザー登録されていません'});
  }
});


// ユーザーページ
userRouter.get('/info', auth, async (_req: Request, res: Response) => {
  const req = _req.body;
  const userData = res.locals.userData;

  // console.log(userData);
  const [response] =
    await db.execute<mysql.RowDataPacket[][]>(
        'CALL getUserData(?, ?);',
        [userData.id, userData.uid]);
  // const userData = row[0][0];
  // console.log(response[0]);
  const data = response[0][0];
  return res.json({
    ...data,
  });
});
