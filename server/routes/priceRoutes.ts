import { AbstractRoutes } from './abstractRoutes';
import SecurityPriceService from '../service/securityPriceService';

class PriceRoutes extends AbstractRoutes {

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.get('/:securityCode', (req, res) => {
      const code = req.params.securityCode;
      const price = SecurityPriceService.getInstance().getPrice(code);
      const accruedInt = SecurityPriceService.getInstance().getAccruedInt(code);
      Promise.all([price, accruedInt]).then(r => res.json({ price: r[0], accruedInt: r[1] }));
    });
  }

}

export default new PriceRoutes().express;