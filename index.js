import server from './server';

const port = 1234;

server.listen(port, () => {
  console.log(`Server is up and running on port number ${port}`);
});
