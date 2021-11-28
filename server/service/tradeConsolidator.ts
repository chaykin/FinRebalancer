import { Trade } from '@prisma/client';
import Average from '../util/math/Average';
import { TYPE_BUY, TYPE_SELL } from './portfolioService';

export default class TradeConsolidator {

  public consolidate(trades: Trade[]): Map<string, Average> {
    const prices = new Map<string, Average>();

    trades.forEach(t => {
      const code = t.securityCode;
      let avg = prices.get(code);

      const count = t.countMultiplier.mul(t.count);

      switch (t.type) {
        case TYPE_BUY:
          if (avg) {
            avg.value = avg.value.plus(t.total);
            avg.count = avg.count.plus(count);
          } else {
            avg = new Average(t.total, count);

            prices.set(code, avg);
          }
          break;
        case TYPE_SELL:
          if (avg.count.minus(count).isZero()) {
            prices.delete(code);
          } else {
            avg.value = avg.value.minus(avg.avg.mul(count));
            avg.count = avg.count.minus(count);
          }
          break;
      }
    });

    return prices;
  }
}
