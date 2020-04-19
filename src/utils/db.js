import mongoose from 'mongoose';
import { config } from './config';

export const connect = (url = config.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useUnifiedTopology: true, useNewUrlParser: true });
};
