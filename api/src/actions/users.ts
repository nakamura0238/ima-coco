import express, {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {prisma} from '../config/db_connection';
import {auth} from '../middlewares/auth';
import {SECRET_KEY} from '../config/keys';

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
  console.log('check');
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

    // prisma
    const check = await prisma.users.findUnique({
      where: {uid: req.uid},
    });

    // ユーザー未登録の確認
    if (!check) {
      // ユーザー未登録の時の処理
      await prisma.users.create({
        data: {
          uid: req.uid,
          password: req.password,
        },
      });

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

  const check = await prisma.users.findUnique({
    where: {uid: req.uid},
  });

  // ユーザー登録のチェック
  if (check) {
    // prisma
    const userData = await prisma.users.findFirst({
      where: {
        uid: req.uid,
        password: req.password,
      },
    });

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

