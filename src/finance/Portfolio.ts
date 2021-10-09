import { Security } from 'src/finance/Security';

export class Portfolio {
  private readonly _securities: Map<string, PortfolioItem> = new Map;

  private _money = 0;

  constructor(public readonly name: string) {
  }

  changeSecurity(security: Security, changeCount: number) {
    const code = security.code;
    const oldItem = this._securities.get(code);
    if (oldItem == undefined) {
      this._securities.set(code, new PortfolioItem(security, changeCount));
    } else {
      const oldCount = oldItem.count;
      const newCount = oldCount + changeCount;
      if (newCount < 0) {
        throw Error(`Invalid security ${code} count. Old value was ${oldCount}, change value was ${changeCount}`);
      } else if (newCount == 0) {
        this._securities.delete(code);
      } else {
        oldItem.count = newCount;
      }
    }
  }

  get securities(): ReadonlyMap<string, IPortfolioItem> {
    return this._securities;
  }

  get money(): number {
    return this._money;
  }

  set money(value: number) {
    this._money = value;
  }
}

export interface IPortfolioItem {
  getCount(): number;

  getSecurity(): Security;
}

class PortfolioItem implements IPortfolioItem {
  constructor(private readonly security: Security, private _count: number) {
  }

  get count(): number {
    return this._count;
  }

  set count(count: number) {
    this._count = count;
  }

  getCount(): number {
    return this.count;
  }

  getSecurity(): Security {
    return this.security;
  }
}
