import SecurityMarketdataFetcher from '../moexapi/fetchers/SecurityMarketdataFetcher';
import { Board } from '../model/Board';
import PrismaMan from '../prisma/PrismaMan';

/**
 * Interval in msec to outdate cache
 */
const OUTDATED_INTERVAL = 30 * 60 * 1000;

export default class SecurityPriceService {
  private readonly cache = new Map<string, { lastUpdate: Date, price: number, accruedInt: number | undefined }>();
  private readonly boardCache = new Map<string, Board>();

  private static instance: SecurityPriceService | null;

  public static getInstance(): SecurityPriceService {
    if (this.instance == null) {
      this.instance = new SecurityPriceService();
    }
    return this.instance;
  }

  private constructor() {
  }

  public getPrice(code: string): Promise<number> {
    return this.retrievePriceData(code).then(d => d.price);
  }

  public getAccruedInt(code: string): Promise<number | undefined> {
    return this.retrievePriceData(code).then(d => d.accruedInt);
  }

  private retrievePriceData(code: string): Promise<{ price: number, accruedInt: number | undefined }> {
    let cacheEntry = this.cache.get(code);
    if (SecurityPriceService.isCacheOutdated(cacheEntry)) {
      return this.retrieveSecurityBoard(code)
        .then(b => new SecurityMarketdataFetcher().fetchMarketdata(code, b))
        .then(data => {
          cacheEntry = { lastUpdate: new Date(), ...data };
          this.cache.set(code, cacheEntry);
          return cacheEntry;
        });
    }

    return Promise.resolve().then(() => cacheEntry);
  }

  private retrieveSecurityBoard(code: string): Promise<Board> {
    let board = this.boardCache.get(code);
    if (board) {
      return Promise.resolve().then(() => board);
    }

    const prisma = PrismaMan.getPrisma();
    return prisma.security.findUnique({
      select: {
        boardId: true,
        market: true,
        engine: true,
        currencyId: true
      },
      where: { code }
    }).then(b => {
      this.boardCache.set(code, b);
      return b;
    });
  }

  private static isCacheOutdated(cacheEntry: { lastUpdate: Date } | undefined): boolean {
    if (cacheEntry) {
      return new Date().getTime() - cacheEntry.lastUpdate.getTime() > OUTDATED_INTERVAL;
    }
    return true;
  }
}