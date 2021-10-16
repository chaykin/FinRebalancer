import { AbstractRoutes } from './abstractRoutes';

class TestRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.get('/test', (req, res, next) => {
      res.json({ value: 'testValue' });
    });
  }
}

export default new TestRoutes().express;