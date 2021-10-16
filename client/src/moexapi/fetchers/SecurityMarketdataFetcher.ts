import {JsonDataTable, MoexJsonResults} from 'src/moexapi/jsonresults/MoexJsonResults';
import {BriefSecurityInfo} from 'src/moexapi/fetchers/BriefSecurityInfoFetcher';
import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';

const MD_COL_WA_PRICE = 'WAPRICE';

const MD_COL_LAST_PRICE = 'LAST';

const SEC_ACCRUED_INT = 'ACCRUEDINT';

/**
 * Fetch security marketdata (such as price)
 */
export class SecurityMarketdataFetcher extends BaseFetcher {

  public fetchMarketdata(briefInfo: BriefSecurityInfo): Promise<SecurityMarketdataInfo> {
    const url = this.buildUrl(
      `engines/${briefInfo.engine}/markets/${briefInfo.market}/boards/${briefInfo.boardId}/securities/${briefInfo.code}`,
      {name: 'iss.only', value: 'marketdata,securities'},
      {name: 'marketdata.columns', value: [MD_COL_WA_PRICE, MD_COL_LAST_PRICE].join(',')},
      {name: 'securities.columns', value: SEC_ACCRUED_INT});

    return this.fetch<SecurityMarketdataInfoJson>(url)
      .then(r => {
        const marketdata = new MoexJsonResults(r.marketdata);
        let price = marketdata.getSingleValue(
          () => true,
          row => row.getOrUndefined(MD_COL_WA_PRICE) || row.getOrUndefined(MD_COL_LAST_PRICE));

        if (price != undefined) {
          price *= (briefInfo.faceValue > 0 ? Number(briefInfo.faceValue) / 100.0 : 1);
        }

        const securities = new MoexJsonResults(r.securities);
        const accruedInt = securities.getSingleValue(() => true, row => row.getOrUndefined(SEC_ACCRUED_INT));

        return new SecurityMarketdataInfo(price || 0, accruedInt || 0);
      });
  }
}

class SecurityMarketdataInfo {
  public readonly price: number;
  public readonly accruedInt: number;

  constructor(price: number, accuredInt: number) {
    this.price = price;
    this.accruedInt = accuredInt;
  }
}

type SecurityMarketdataInfoJson = {
  marketdata: JsonDataTable<number>
  securities: JsonDataTable<number>
}
