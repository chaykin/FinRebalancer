import {BriefSecurityInfo} from 'src/moexapi/fetchers/BriefSecurityInfoFetcher';

export class Security {
  public readonly code: string
  public readonly shortName: string;
  public readonly fullName: string;
  public readonly typeName: string;
  public readonly faceValue: number;
  public readonly daysToRedemption: number

  public readonly boardId: string
  public readonly market: string
  public readonly engine: string
  public readonly currencyId: string

  private _price: number;

  //НКД
  private _accruedInterest: number;

  /**
   * Summary of all future coupons
   */
  private _bondization: number;

  constructor(info: BriefSecurityInfo, price = 0, accruedInterest = 0, bondization = 0) {
    //TODO: I suspect, there is a better way to copy list of fields
    this.code = info.code;
    this.shortName = info.shortName;
    this.fullName = info.fullName;
    this.typeName = info.typeName;
    this.faceValue = info.faceValue;
    this.daysToRedemption = info.daysToRedemption;

    this.boardId = info.boardId;
    this.market = info.market;
    this.engine = info.engine;
    this.currencyId = info.currencyId;

    this._price = price;
    this._accruedInterest = accruedInterest;
    this._bondization = bondization;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get accuredInterest(): number {
    return this._accruedInterest;
  }

  set accuredInterest(value: number) {
    this._accruedInterest = value;
  }

  get bondization(): number {
    return this._bondization;
  }

  set bondization(value: number) {
    this._bondization = value;
  }
}
