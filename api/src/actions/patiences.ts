import express, {Request, Response} from 'express';
import {prisma} from '../config/db_connection';
import {auth} from '../middlewares/auth';

// 型定義
type UserToken = {
  id: number,
  access_key: string,
  name: string
}


// eslint-disable-next-line new-cap
export const patienceRouter = express.Router();

patienceRouter.route('/')
    .get(auth, async (_req: Request, res: Response) => {
      try {
        const userData: UserToken = res.locals.userData;

        if (userData) {
          const list = await prisma.users.findMany({
            where: {name: userData.name},
            select: {
              id: true,
              name: true,
              display_name: true,
              patiences: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  comment: true,
                  purchase: true,
                  userId: false,
                },
              },
            },
          });

          console.log(list[0]);
          return res.send({
            check: true,
            data: list[0],
          });
        }
      } catch (err) {
        console.log(err);
        return res.send({
          check: false,
          data: null,
        });
      }
    })
    .post(auth, async (_req: Request, res: Response) => {
      const req = _req.body;
      // console.log(req);
      const userData: UserToken = res.locals.userData;

      if (userData) {
        // データの挿入
        await prisma.patiences.create({
          data: {
            userId: userData.id,
            title: req.title,
            price: req.price,
            comment: req.comment,
          },
        });

        const list = await prisma.users.findMany({
          where: {
            id: userData.id,
            name: userData.name,
          },
          include: {patiences: true},
        });
        console.log(list[0]);
        res.send(list[0]);
      }
    })
    .put(auth, async (_req: Request, res: Response) => {
      const req = _req.body;
      const userData: UserToken = res.locals.userData;

      if (userData) {
        // データの更新
        await prisma.patiences.update({
          where: {
            id: req.id,
          },
          data: {
            title: req.title,
            price: req.price,
            comment: req.comment,
          },
        });

        const list = await prisma.users.findMany({
          where: {
            id: userData.id,
            name: userData.name,
          },
          include: {patiences: true},
        });
        console.log(list);
        res.send(list[0]);
      }
    });
patienceRouter.route('/:itemId')
    .delete(auth, async (_req: Request, res: Response) => {
      const itemId = parseInt(_req.params.itemId);
      // console.log(req);
      const userData: UserToken = res.locals.userData;

      if (userData) {
        // データの挿入
        await prisma.patiences.delete({
          where: {
            id: itemId,
          },
        });

        const list = await prisma.users.findMany({
          where: {
            id: userData.id,
            name: userData.name,
          },
          include: {patiences: true},
        });
        console.log(list);
        res.send(list[0]);
      }
    });
