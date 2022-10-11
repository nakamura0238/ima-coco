import express, {Application} from 'express';
import cors from 'cors';

// import {mainRouter} from './actions/main';
import {userRouter} from './actions/users';
// import {wantedRouter} from './actions/wanted_articles';
import {stateRouter} from './actions/state';
import {lineRouter} from './actions/line';
import {roomRouter} from './actions/rooms';

import {createServer} from 'http';
import {Server} from 'socket.io';

import {socketManager} from './actions/socket';


const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
},
));

// ルーティングの設定
// app.use('/', mainRouter);
/**
   * get  "/": データ表示
   * post "/": データ表示
   */

app.use('/user', userRouter);
/**
   * get  "/user/"  : データ表示
   * post "/user/"  : データ表示
   * get  "/user/db": データ取得
   * post "/user/db": データ挿入
   */

app.use('/state', stateRouter);
/**
   * get    "/state/"  : データ表示
   * post   "/state/"  : データ登録
   * put    "/state/"  : データ更新
   * delete "/state/"  : データ削除
   */

app.use('/line', lineRouter);
app.use('/room', roomRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

socketManager(io);


try {
  httpServer.listen(PORT, () => {
    console.log(`dev server running at: http://ima-coco/api`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
