import { AbstractRoutes } from './abstractRoutes';
import PortfolioService, { TYPE_BUY, TYPE_SELL, TYPE_SPLIT } from '../service/portfolioService';
import { Prisma } from '.prisma/client';

class PortfolioRoutes extends AbstractRoutes {
  private readonly portfolioService = new PortfolioService();

  constructor() {
    super();
  }

  protected routes(): void {
    this.express.get('/createPortfolio', (req, res) => {
      const code = req.query.code;
      const name = req.query.name;
      if (code && name) {
        this.portfolioService.createOrUpdatePortfolio(code.toString(), name.toString()).then(r => res.json(r));
      } else {
        res.json({});
      }
    });

    this.express.get('/portfolios', (req, res) => {
      this.portfolioService.getPortfolios().then(r => res.json(r));
    });

    this.express.get('/:portfolioCode', (req, res) => {
      const code = req.params.portfolioCode;
      this.portfolioService.getPortfolio(code).then(p => res.json(p));
    });

    this.express.get('/:portfolioCode/addTrade', (req, res) => {
      const portfolioCode = req.params.portfolioCode;
      const type = req.query.type?.toString();
      const tradeDate = new Date(req.query.tradeDate?.toString());
      const securityCode = req.query.securityCode?.toString();
      if (type === TYPE_BUY || type === TYPE_SELL) {
        const count = Number(req.query.count?.toString());
        const price = new Prisma.Decimal(req.query.price?.toString());
        const total = new Prisma.Decimal(req.query.total?.toString());

        this.portfolioService.addNormalTrade(portfolioCode, type, count, price, total, tradeDate, securityCode).then(r => res.json(r));
      } else if (type === TYPE_SPLIT) {
        const multiplier = new Prisma.Decimal(req.query.multiplier?.toString());
        this.portfolioService.addSpecialTrade(portfolioCode, type, tradeDate, securityCode, multiplier).then(r => res.json(r));
      } else {
        res.json({});
      }
    });
  }
}

export default new PortfolioRoutes().express;