export class Security {
  readonly code: string;
  readonly shortName: string;
  readonly fullName: string;

  private _price: number;

  constructor(code: string, shortName: string, fullName: string, price = 0) {
    this.code = code;
    this.shortName = shortName;
    this.fullName = fullName;

    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }
}
