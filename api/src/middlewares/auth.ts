import {Request, Response, NextFunction} from 'express';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import {prisma} from '../config/db_connection';
import {SECRET_KEY} from '../config/keys';


// 型定義
type TokenPayload = {
  user: UserToken;
};

type UserToken = {
  id: number,
  uid: string
}

// 認証ミドルウェア
export const auth =
  async (_req: Request, res: Response, next: NextFunction) => {
    // console.log('auth');
    // try {
    const headers = _req.headers;
    const token = headers.authorization;

    let user = null;
    if (token) {
      try {
      // トークンのデコード
        const tokenData: TokenPayload =
          jwt.verify(token, SECRET_KEY) as TokenPayload;
        const userData: UserToken = tokenData.user;
        res.locals.userData = userData;
        console.log('token: ', userData);
        // prisma
        user = await prisma.users.findFirst({
          where: {
            id: userData.id,
            uid: userData.uid,
          },
        });
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          console.error('トークンの有効期限が切れています。', err);
        } else if (err instanceof jwt.JsonWebTokenError) {
          console.error('トークンが不正です。', err);
        } else {
          console.error('トークンの検証でその他のエラーが発生しました。', err);
        }
        console.log(err);
      }
    }

    if (!user) {
      // return res.json({
      //   check: false,
      // });
      res.status(403).send('認証に失敗しました');
      // throw new Error('認証エラー');
    }
    next();
    // } catch (err) {
    //   console.log(err);
    //   return res.json({
    //     check: false,
    //   });
    // }
  };
