import { config } from './utils/config';
import server from './server';

const port = config.port || 1234;

server.listen(port, () => {
  console.log(`Server is up and running on port number ${port}`);
});
