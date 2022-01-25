import { httpServer, httpsServer } from './app';

httpServer.listen(8000);

httpsServer.listen(3001, () => {
  console.log('Listening on port 3001!');
});
