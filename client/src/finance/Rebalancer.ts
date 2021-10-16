import {IPortfolioItem, Portfolio} from 'src/finance/Portfolio';
import {InvestmentPlan} from 'src/finance/InvestmentPlan';
import {InvestmentPlanCategory} from 'src/finance/InvestmentPlanCategory';
import {Security} from 'src/finance/Security';

const ONE_HUNDRED = 100.0;

export class Rebalancer {

  rebalance(portfolio: Portfolio, plan: InvestmentPlan) {
    const root = new RebalancedCategory(portfolio, [plan, ONE_HUNDRED]);
    root.calcTargetValue(root.currentValue + portfolio.money);
    return root;
  }
}

export class RebalancedCategory {
  readonly currentValue = 0;

  private readonly planCategory: InvestmentPlanCategory | InvestmentPlan;
  private readonly _children: RebalancedCategory[] = [];
  private readonly _rebalancedSecurityItems: { security: Security, currentValue: number, currentPercent: number }[] = [];
  private readonly _targetPercent;
  private readonly totalTargetPercent;

  private currentPercent = ONE_HUNDRED;
  private _targetValue = 0;

  constructor(portfolio: Portfolio, planCategoryItem: [InvestmentPlanCategory | InvestmentPlan, number], totalTargetPercent = 100) {
    this.planCategory = planCategoryItem[0];
    this._targetPercent = planCategoryItem[1];
    this.totalTargetPercent = totalTargetPercent * this.targetPercent / ONE_HUNDRED;

    this._children = [...this.getCategories().entries()].map(e => new RebalancedCategory(portfolio, e, this.totalTargetPercent));

    this.currentValue += this.calcCategoryValue(portfolio.securities);
    this._children.forEach(c => c.currentPercent = ONE_HUNDRED * c.currentValue / this.currentValue);
  }

  get name() {
    return this.planCategory.name;
  }

  get percent() {
    return this.currentPercent;
  }

  get value() {
    return this.currentValue;
  }

  get targetPercent() {
    return this._targetPercent;
  }

  get targetValue() {
    return this._targetValue;
  }

  get children() {
    return this._children;
  }

  get rebalancedSecurityItems() {
    return this._rebalancedSecurityItems;
  }

  calcTargetValue(totalPrice: number) {
    this._targetValue = this.totalTargetPercent * totalPrice / ONE_HUNDRED;
    this._children.forEach(c => c.calcTargetValue(totalPrice));
  }

  private calcCategoryValue(securities: ReadonlyMap<string, IPortfolioItem>): number {
    let value = this._children.map(c => c.currentValue).reduce((r, v) => r + v, 0);

    if (this.planCategory instanceof InvestmentPlanCategory) {
      let securityValue = 0;
      for (const code of this.planCategory.securityCodes) {
        const item = securities.get(code);
        if (item != undefined) {
          const security = item.getSecurity();
          const val = security.price * item.getCount();

          this._rebalancedSecurityItems.push({security: security, currentValue: val, currentPercent: 0});
          securityValue += val;
        }
      }
      value += securityValue;

      this._rebalancedSecurityItems.forEach(item => item.currentPercent = ONE_HUNDRED * item.currentValue / securityValue);
    }

    return value;
  }

  private getCategories() {
    if (this.planCategory instanceof InvestmentPlan) {
      return this.planCategory.categories;
    }
    return this.planCategory.children;
  }
}
