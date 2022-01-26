import { httpServer, httpsServer } from './app';

httpServer.listen(8001, () => {
  console.log('http: Listening on port 8001!');
});

httpsServer.listen(3001, () => {
  console.log('https: Listening on port 3001!');
});
