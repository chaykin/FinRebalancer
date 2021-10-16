import { AbstractRoutes } from './abstractRoutes';
import TestRoutes from './testRoutes';

class ApiRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.get('/', (req, res) => {
      res.send('It works!');
    });

    this.express.use('/api', TestRoutes);

    // handle undefined routes
    this.express.use('*', (req, res) => {
      res.send('Invalid URL!');
    });
  }
}

export default new ApiRoutes().express;