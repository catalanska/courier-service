import express from 'express';

const server = express();

server.use(express.json());

server.use((err, _req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).send(err.validationErrors.body);
    next();
  } else next(err);
});

export default server;
