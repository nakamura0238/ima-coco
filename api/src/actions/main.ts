// import express, {Request, Response} from 'express';
// import * as jwt from 'jsonwebtoken';
// import {prisma} from '../config/db_connection';

// const SECRET_KEY = 'secret_key';

// // eslint-disable-next-line new-cap
// export const mainRouter = express.Router();

// type TokenPayload = {
//   user: UserToken;
// };

// type UserToken = {
//   id: number,
//   access_key: string,
//   name: string
// }

// mainRouter.route('/')
//     .get(async (_req: Request, res: Response) => {
//       const u:any = await prisma.users.findUnique({
//         where: {
//           id: 1,
//         },
//         include: {
//           wanted_articles: {
//             select: {
//               id: true,
//               title: true,
//               price: true,
//               comment: true,
//             },
//           },
//         },
//       });
//       console.log(u);
//       res.status(200).send({
//         message: 'Create User!!',
//       });
//     })
//     .post(async (_req: Request, res: Response) => {
//       try {
//         const req = _req.headers;
//         const token = req.authorization;
//         if (token) {
//           // トークンのデコード
//           const tokenData: TokenPayload =
//             jwt.verify(token, SECRET_KEY) as TokenPayload;
//           const userData: UserToken = tokenData.user;

//           console.log(userData.access_key);
//           // ユーザーの確認
//           const responseData = await prisma.users.findUnique({
//             where: {name: userData.name},
//           });

//           res.json(responseData);
//         }
//       } catch (err) {
//         console.log(err);
//         res.json({
//           check: false,
//         });
//       }
//     });
