import { AbstractRoutes } from './abstractRoutes';
import ApiRoutes from './apiRoutes';

class ServerRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.get('/', (req, res) => {
      res.send('It works!');
    });

    this.express.use('/api', ApiRoutes);

    // handle undefined routes
    this.express.use('*', (req, res) => {
      res.send('Invalid URL!');
    });
  }
}

export default new ServerRoutes().express;