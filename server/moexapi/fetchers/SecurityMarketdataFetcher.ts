import { BaseFetcher } from './BaseFetcher';
import { JsonDataTable, MoexJsonResults } from '../jsonresults/MoexJsonResults';
import { Board } from '../../model/Board';

const MD_COL_WA_PRICE = 'WAPRICE';
const MD_COL_LAST_PRICE = 'LAST';
const SEC_ACCRUED_INT = 'ACCRUEDINT';

/**
 * Fetch security marketdata (such as price)
 */
export default class SecurityMarketdataFetcher extends BaseFetcher {

  public fetchMarketdata(code: string, board: Board): Promise<{ price: number, accruedInt: number | undefined }> {
    const url = this.buildUrl(
      `engines/${board.engine}/markets/${board.market}/boards/${board.boardId}/securities/${code}`,
      { name: 'iss.only', value: 'marketdata,securities' },
      { name: 'marketdata.columns', value: [MD_COL_WA_PRICE, MD_COL_LAST_PRICE].join(',') },
      { name: 'securities.columns', value: SEC_ACCRUED_INT });

    return this.fetch<SecurityMarketdataInfoJson>(url)
      .then(r => {
        const marketdata = new MoexJsonResults(r.marketdata);
        let price = marketdata.getSingleValue(
          () => true,
          row => row.getOrUndefined(MD_COL_WA_PRICE) || row.getOrUndefined(MD_COL_LAST_PRICE));

        const securities = new MoexJsonResults(r.securities);
        const accruedInt = securities.getSingleValue(() => true, row => row.getOrUndefined(SEC_ACCRUED_INT));

        return { price, accruedInt };
      });
  }
}

type SecurityMarketdataInfoJson = {
  marketdata: JsonDataTable<number>
  securities: JsonDataTable<number>
}