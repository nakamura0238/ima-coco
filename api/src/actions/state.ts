import express, {NextFunction, Request, Response} from 'express';
import {prisma} from '../config/db_connection';
import {auth} from '../middlewares/auth';
// import {SECRET_KEY} from '../config/keys';

// eslint-disable-next-line new-cap
export const stateRouter = express.Router();

// state
stateRouter.get('/', auth, async (_req: Request, res: Response) => {
  try {
    const req = res.locals.userData;
    console.log(req.uid);

    const states = await prisma.state_data.findMany({
      where: {
        OR: [
          {common: true},
          {userId: req.id},
        ],
      },
      select: {
        id: true,
        state: true,
        common: true,
      },
    });

    console.log('states', states);
    const resStates = states;

    return res.json({
      check: true,
      data: {
        stateData: resStates,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      check: false,
    });
  }
});


// state
stateRouter.post('/', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報
        const user = res.locals.userData; // ユーザー情報

        console.log('reqBody:', reqBody);
        console.log('user:', user);

        const createState = await prisma.state_data.create({
          data: {
            state: reqBody.state,
            common: false,
            userId: user.id,
          },
        });

        console.log(createState);

        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);

// state更新
stateRouter.put('/', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報
        const user = res.locals.userData; // ユーザー情報

        console.log('reqBody:', reqBody);
        console.log('user:', user);

        const createState = await prisma.state_data.update({
          where: {
            id: reqBody.id,
          },
          data: {
            state: reqBody.state,
          },
        });

        console.log(createState);

        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);

// state削除
stateRouter.delete('/:id', auth,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const reqBody = _req.body; // リクエスト情報
        const user = res.locals.userData; // ユーザー情報

        console.log('reqBody:', reqBody);
        console.log('user:', user);

        const id = Number(_req.params.id);

        const createState = await prisma.state_data.delete({
          where: {
            id: id,
          },
        });

        console.log(createState);

        res.send('OK');
      } catch (err) {
        next(err);
      }
    },
);
