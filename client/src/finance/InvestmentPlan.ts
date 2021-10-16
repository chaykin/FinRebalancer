import { InvestmentPlanCategory } from 'src/finance/InvestmentPlanCategory';

export class InvestmentPlan {
  readonly name: string;
  private _categories: Map<InvestmentPlanCategory, number> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  changeCategory(category: InvestmentPlanCategory, targetPercent: number) {
    this._categories.set(category, targetPercent);
  }

  get categories(): ReadonlyMap<InvestmentPlanCategory, number> {
    return this._categories;
  }
}
