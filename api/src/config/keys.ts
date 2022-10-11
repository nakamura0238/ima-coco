import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

export const SECRET_KEY = process.env.SECRET_KEY as jwt.Secret;
