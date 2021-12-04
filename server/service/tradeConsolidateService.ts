import PrismaMan from '../prisma/PrismaMan';
import { TYPE_BUY, TYPE_SELL } from './portfolioService';
import { Prisma } from '.prisma/client';
import TradeConsolidator from './tradeConsolidator';
import { getDateForMode, T2 } from './tradeDateService';

export default class TradeConsolidateService {
  private static instance: TradeConsolidateService | null;

  private readonly cache = new Map<string, Map<string, Consolidation>>();

  public static getInstance(): Promise<TradeConsolidateService> {
    if (this.instance == null) {
      this.instance = new TradeConsolidateService();
      return this.instance.invalidateCache().then(() => this.instance);
    }

    return Promise.resolve().then(() => this.instance);
  }

  private constructor() {
  }

  public invalidateCache() {
    this.cache.clear();

    const tradeConsolidator = new TradeConsolidator();
    const prisma = PrismaMan.getPrisma();
    return prisma.portfolio.findMany({
      include: {
        trades: {
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
            type: {
              in: [TYPE_BUY, TYPE_SELL]
            },
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
          },

          orderBy: { tradeDate: 'asc' }
        }
      }
    })
      .then(r => r.forEach(p => this.cache.set(p.code, tradeConsolidator.consolidate(p.trades))));
  }

  public getSecurityConsolidation(portfolioCode: string, securityCode: string): Consolidation {
    const portfolioConsolidation = this._getPortfolioSecurityConsolidation(portfolioCode);

    let securityConsolidation = portfolioConsolidation.get(securityCode);
    if (!securityConsolidation) {
      securityConsolidation = { count: new Prisma.Decimal(0), avg: new Prisma.Decimal(0) };
    }

    return securityConsolidation;
  }

  public getPortfolioSecurityConsolidation(portfolioCode: string): PortfolioConsolidationContainer {
    return new PortfolioConsolidationContainer(this._getPortfolioSecurityConsolidation(portfolioCode));
  }

  private _getPortfolioSecurityConsolidation(portfolioCode: string): Map<string, Consolidation> {
    const portfolioConsolidation = this.cache.get(portfolioCode);
    if (!portfolioConsolidation) {
      throw new Error(`Could not find consolidation data for portfolio ${portfolioCode}`);
    }

    return portfolioConsolidation;
  }
}

export class PortfolioConsolidationContainer {
  private readonly data: Map<string, Consolidation>;

  constructor(data: Map<string, Consolidation>) {
    this.data = new Map(data);
  }

  public extract(key: string): Consolidation {
    let securityConsolidation = this.data.get(key);
    if (securityConsolidation) {
      this.data.delete(key);
    } else {
      securityConsolidation = { count: new Prisma.Decimal(0), avg: new Prisma.Decimal(0) };
    }

    return securityConsolidation;
  }

  public getKeys(): IterableIterator<string> {
    return this.data.keys();
  }
}

export type Consolidation = { count: Prisma.Decimal, avg: Prisma.Decimal }