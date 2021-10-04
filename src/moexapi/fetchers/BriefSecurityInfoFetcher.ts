import {DataRow, JsonDataTable, MoexJsonResults} from 'src/moexapi/jsonresults/MoexJsonResults';
import {FilterFactory} from 'src/moexapi/jsonresults/FilterFactory';
import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';

const DESCR_COL_NAME = 'name';
const DESCR_COL_VALUE = 'value';

const BOARD_COL_BOARD_ID = 'boardid';
const BOARD_COL_MARKET = 'market';
const BOARD_COL_ENGINE = 'engine';
const BOARD_COL_IS_PRIMARY = 'is_primary';
const BOARD_COL_CURRENCY_ID = 'currencyid';

const SHORT_NAME_VAL = 'SHORTNAME';
const FULL_NAME_VAL = 'NAME';
const FACEVALUE_VAL = 'FACEVALUE';
const DAYS_TO_REDEMPTION_VAL = 'DAYSTOREDEMPTION';
const TYPE_NAME_VAL = 'TYPENAME';

const IS_PRIMARY_VAL = 1;

/**
 * Fetch brief security info by code: boardId/market/etc. These fields are rarely changes for the security.
 */
export class BriefSecurityInfoFetcher extends BaseFetcher {

  public fetchBriefSecurityInfo(code: string): Promise<BriefSecurityInfo> {
    const url = this.buildUrl(`securities/${code}`,
      {name: 'description.columns', value: BriefSecurityInfoFetcher.getDescrCols().join(',')},
      {name: 'boards.columns', value: BriefSecurityInfoFetcher.getBoardsCols().join(',')});

    return this.fetch<BriefSecurityInfoJson>(url)
      .then(r => {
        const descr = new MoexJsonResults(r.description);
        const shortName = BriefSecurityInfoFetcher.getDescrValue(descr, SHORT_NAME_VAL);
        const fullName = BriefSecurityInfoFetcher.getDescrValue(descr, FULL_NAME_VAL);
        const typeName = BriefSecurityInfoFetcher.getDescrValue(descr, TYPE_NAME_VAL);
        const faceValue = BriefSecurityInfoFetcher.getDescrNumValue(descr, FACEVALUE_VAL);
        const daysToRedemption = BriefSecurityInfoFetcher.getDescrNumValue(descr, DAYS_TO_REDEMPTION_VAL);

        const descrInfo = new SecurityDescriptionInfo(shortName, fullName, typeName, faceValue, daysToRedemption);

        const boards = new MoexJsonResults(r.boards);
        const boardsFilter = FilterFactory.createByColFilter(BOARD_COL_IS_PRIMARY, <string | number>IS_PRIMARY_VAL);
        const info = boards.getSingleValue(boardsFilter, row => new BriefSecurityInfo(code, descrInfo, row));
        if (info === undefined) {
          throw new Error(`Could not fetch brief security info by code ${code}`);
        }

        return info;
      });
  }

  private static getDescrNumValue(results: MoexJsonResults<string>, val: string): number {
    const faceValue = BriefSecurityInfoFetcher.getDescrValue(results, val);
    if (faceValue.length === 0) {
      return 0;
    }

    return Number(faceValue);
  }

  private static getDescrValue(results: MoexJsonResults<string>, val: string): string {
    const filter = FilterFactory.createByColFilter(DESCR_COL_NAME, val);
    return results.getSingleValue(filter, row => row.get(DESCR_COL_VALUE)) || '';
  }

  private static getDescrCols(): string[] {
    return [DESCR_COL_NAME, DESCR_COL_VALUE];
  }

  private static getBoardsCols(): string[] {
    return [BOARD_COL_BOARD_ID, BOARD_COL_MARKET, BOARD_COL_ENGINE, BOARD_COL_IS_PRIMARY, BOARD_COL_CURRENCY_ID];
  }
}

export class BriefSecurityInfo {
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

  constructor(code: string, descrInfo: SecurityDescriptionInfo, row: DataRow<string | number>) {
    this.code = code;
    this.shortName = descrInfo.shortName;
    this.fullName = descrInfo.fullName;
    this.typeName = descrInfo.typeName;
    this.faceValue = descrInfo.faceValue;
    this.daysToRedemption = descrInfo.daysToRedemption;

    this.boardId = <string>row.get(BOARD_COL_BOARD_ID);
    this.market = <string>row.get(BOARD_COL_MARKET);
    this.engine = <string>row.get(BOARD_COL_ENGINE);
    this.currencyId = <string>row.get(BOARD_COL_CURRENCY_ID);
  }
}

class SecurityDescriptionInfo {
  public readonly shortName: string;
  public readonly fullName: string;
  public readonly typeName: string;
  public readonly faceValue: number;
  public readonly daysToRedemption: number;

  constructor(shortName: string, fullName: string, typeName: string, faceValue: number, daysToRedemption: number) {
    this.shortName = shortName;
    this.fullName = fullName;
    this.typeName = typeName;
    this.faceValue = faceValue;
    this.daysToRedemption = daysToRedemption;
  }
}

type BriefSecurityInfoJson = {
  description: JsonDataTable<string>,
  boards: JsonDataTable<string | number>
}
