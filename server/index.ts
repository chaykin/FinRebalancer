import * as http from 'http';
import ApiRoutes from './routes/apiRoutes';

ApiRoutes.set('port', process.env.PORT || 3080);
const server = http.createServer(ApiRoutes);
server.listen(ApiRoutes.get('port'), () => {
  console.log('App running at:');
  console.log('- Local: http://localhost:%d', ApiRoutes.get('port'));
});

module.exports = ApiRoutes;