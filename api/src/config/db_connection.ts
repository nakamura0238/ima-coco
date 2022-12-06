import mysql from 'mysql2';
import {PrismaClient} from '@prisma/client';

// .envファイルで管理する
const dbConfig = {
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'ima_coco',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);
export const db = pool.promise();

// export const prisma = new PrismaClient();
