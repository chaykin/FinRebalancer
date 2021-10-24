import * as http from 'http';
import ServerRoutes from './routes/serverRoutes';

ServerRoutes.set('port', process.env.PORT || 3080);
const server = http.createServer(ServerRoutes);
server.listen(ServerRoutes.get('port'), () => {
  console.log('App running at:');
  console.log('- Local: http://localhost:%d', ServerRoutes.get('port'));
});

module.exports = ServerRoutes;