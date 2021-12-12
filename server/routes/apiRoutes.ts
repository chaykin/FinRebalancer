import { AbstractRoutes } from './abstractRoutes';
import PortfolioRoutes from './portfolioRoutes';
import PriceRoutes from './priceRoutes';

class ApiRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.use('/portfolio', PortfolioRoutes);
    this.express.use('/price', PriceRoutes)
  }
}

export default new ApiRoutes().express;