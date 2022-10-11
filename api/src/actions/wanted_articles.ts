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
export const wantedRouter = express.Router();

wantedRouter.route('/')
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
              wanted_articles: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  comment: true,
                  userId: false,
                },
              },
            },
          });

          let sum = 0;
          list[0].wanted_articles.map((val, i) => {
            sum += val.price;
          });

          console.log(list[0]);
          console.log(sum);
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
        await prisma.wanted_articles.create({
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
          include: {wanted_articles: true},
        });
        console.log(list);
        res.send(list[0]);
      }
    })
    .put(auth, async (_req: Request, res: Response) => {
      const req = _req.body;
      const userData: UserToken = res.locals.userData;

      if (userData) {
        // データの挿入
        await prisma.wanted_articles.update({
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
          include: {wanted_articles: true},
        });
        console.log(list);
        res.send(list[0]);
      }
    });
wantedRouter.route('/:itemId')
    .delete(auth, async (_req: Request, res: Response) => {
      const itemId = parseInt(_req.params.itemId);
      // console.log(req);
      const userData: UserToken = res.locals.userData;

      if (userData) {
        // データの挿入
        await prisma.wanted_articles.delete({
          where: {
            id: itemId,
          },
        });

        const list = await prisma.users.findMany({
          where: {
            id: userData.id,
            name: userData.name,
          },
          include: {wanted_articles: true},
        });
        console.log(list);
        res.send(list[0]);
      }
    });
