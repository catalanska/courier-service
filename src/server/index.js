import express from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { Error as MongooseError } from 'mongoose';
import { connect } from '../utils/db';
import courierRouter from '../routes/courierRouter.js';

connect();
const server = express();

server.use(express.json());

server.use('/couriers', courierRouter);

server.use((error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    res.status(400).json(error);
  }
  if (error instanceof MongooseError) {
    res.status(422).json(error);
  }
  res.status(500).send();
});

export default server;
