import dotenv from 'dotenv';
dotenv.config();

export const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
};
