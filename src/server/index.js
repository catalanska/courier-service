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
    res.status(400).send(error);
  } else if (error instanceof MongooseError) {
    res.status(422).send(error);
  } else res.status(500).send(error);
});

export default server;
