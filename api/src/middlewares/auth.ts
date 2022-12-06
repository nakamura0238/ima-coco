import {Request, Response, NextFunction} from 'express';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import {db} from '../config/db_connection';
import {SECRET_KEY} from '../config/keys';

import mysql from 'mysql2';

// 型定義
type TokenPayload = {
  user: UserToken;
};

type UserToken = {
  id: number;
  uid: string;
};

// 認証ミドルウェア
export const auth = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
  const headers = _req.headers;
  const token = headers.authorization;

  // console.log('header token: ', token);

  let user = null;
  if (token) {
    try {
      // トークンのデコード
      const tokenData: TokenPayload = jwt.verify(
          token,
          SECRET_KEY,
      ) as TokenPayload;
      const userData: UserToken = tokenData.user;
      res.locals.userData = userData;
      // console.log('token: ', userData);

      const sql = 'CALL getUserData(?, ?);';
      const params = [userData.id, userData.uid];
      const [response] =
        await db.execute<mysql.RowDataPacket[][]>(sql, params);
      user = response[0][0];
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

  // console.log('auth user: ', user);

  if (!user) {
    // return res.json({
    //   check: false,
    // });
    res.status(403).send('認証に失敗しました');
    // throw new Error('認証エラー');
  }
  next();
};
