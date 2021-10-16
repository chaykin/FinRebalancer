export class InvestmentPlanCategory {
  readonly name: string;

  private readonly _children: Map<InvestmentPlanCategory, number> = new Map();
  private readonly _securityCodes: Set<string> = new Set;

  constructor(name: string) {
    this.name = name;
  }

  changeChildCategory(category: InvestmentPlanCategory, targetPercent: number) {
    this._children.set(category, targetPercent);
  }

  addSecurityCode(code: string) {
    this._securityCodes.add(code);
  }

  removeSecurityCode(code: string) {
    this._securityCodes.delete(code);
  }

  get securityCodes(): ReadonlySet<string> {
    return this._securityCodes;
  }

  get children(): ReadonlyMap<InvestmentPlanCategory, number> {
    return this._children;
  }
}
