import { Prisma } from '.prisma/client';

export default class Average {
  private _value: Prisma.Decimal;
  private _count: Prisma.Decimal;
  private _avg: Prisma.Decimal;

  private isDirty = true;

  constructor(value: Prisma.Decimal, count: Prisma.Decimal) {
    const decimalConstructor = Prisma.Decimal.clone({ precision: 16 });
    this._value = new decimalConstructor(value);
    this._count = new decimalConstructor(count);
  }

  get value(): Prisma.Decimal {
    return this._value;
  }

  set value(value: Prisma.Decimal) {
    this._value = value;
    this.isDirty = true;
  }

  get count(): Prisma.Decimal {
    return this._count;
  }

  set count(count: Prisma.Decimal) {
    this._count = count;
    this.isDirty = true;
  }

  get avg(): Prisma.Decimal {
    if (this.isDirty) {
      this._avg = this._value.div(this._count);
      this.isDirty = false;
    }

    return this._avg;
  }
}