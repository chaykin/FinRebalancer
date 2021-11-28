import { Portfolio, PortfolioGroup, PortfolioGroupItem, Trade } from '@prisma/client';
import PrismaMan from '../prisma/PrismaMan';
import { Prisma } from '.prisma/client';
import SecurityService from './securityService';
import TradeConsolidateService from './tradeConsolidateService';
import PortfolioConsolidator, { PortfolioConsolidation } from './portfolioConsolidator';
import { getDateForMode, T2 } from './tradeDateService';

export const TYPE_BUY = 'buy';
export const TYPE_SELL = 'sell';
export const TYPE_SPLIT = 'split';

export default class PortfolioService {

  public createOrUpdatePortfolio(code: string, name: string): Promise<Portfolio> {
    const portfolio = { code: code, name: name };

    const prisma = PrismaMan.getPrisma();
    return prisma.portfolio.upsert({
      create: portfolio,
      update: portfolio,
      where: { code: code }
    });
  }

  public deletePortfolio(code: string) {
    //TODO
  }

  public getPortfolios(): Promise<{ code: string, name: string }[]> {
    const prisma = PrismaMan.getPrisma();

    return prisma.portfolio.findMany({
      select: {
        code: true,
        name: true
      }
    });
  }

  public getPortfolio(code: string): Promise<PortfolioConsolidation> {
    const prisma = PrismaMan.getPrisma();

    return TradeConsolidateService.getInstance().then(srv =>
      prisma.portfolio.findUnique({
        where: { code },
        include: {
          portfolioGroups: {
            include: {
              items: {
                include: {
                  security: {
                    include: {
                      bond: {
                        select: {
                          matDate: true
                        }
                      }
                    }
                  }
                },
                where: {
                  security: {
                    OR: [
                      { bond: null },
                      {
                        bond: {
                          matDate: {
                            gte: getDateForMode(T2)
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }).then(p => new PortfolioConsolidator().consolidate(srv, p))
    );
  }

  public addNormalTrade(portfolioCode: string, type: string, count: number, price: Prisma.Decimal, total: Prisma.Decimal, tradeDate: Date, securityCode: string): Promise<Trade> {
    const prisma = PrismaMan.getPrisma();

    return new SecurityService().createOrUpdateSecurity(securityCode)
      .then(() => prisma.trade.create({
        data: {
          portfolioCode: portfolioCode,
          type: type,
          count: count,
          price: price,
          total: total,
          tradeDate: tradeDate,
          securityCode: securityCode
        }
      }));
  }

  public addSpecialTrade(portfolioCode: string, type: string, tradeDate: Date, securityCode: string, multiplier: Prisma.Decimal): Promise<Trade> {
    const prisma = PrismaMan.getPrisma();

    return new SecurityService().createOrUpdateSecurity(securityCode)
      .then(() => prisma.trade.create({
        data: {
          portfolioCode: portfolioCode,
          type: type,
          count: 0,
          price: new Prisma.Decimal(0),
          total: new Prisma.Decimal(0),
          tradeDate: tradeDate,
          securityCode: securityCode,
          countMultiplier: multiplier
        }
      }))
      .then(t => {
        return prisma.trade.updateMany({
          where: {
            portfolioCode: portfolioCode,
            type: { in: [TYPE_BUY, TYPE_SELL] },
            tradeDate: { lte: tradeDate },
            securityCode: securityCode
          }, data: {
            countMultiplier: { multiply: multiplier }
          }
        }).then(() => t);
      });
  }
}
