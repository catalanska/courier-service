import express from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { connect } from '../utils/db';
import courierRouter from '../routes/courierRouter.js';

const server = express();

server.use(express.json());

server.use('/couriers', courierRouter);

server.use((err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    err.status = 400;
  }
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
  });
});

export default server;
