import { AbstractRoutes } from './abstractRoutes';
import PortfolioRoutes from './portfolioRoutes';

class ApiRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.use('/portfolio', PortfolioRoutes);
  }
}

export default new ApiRoutes().express;