import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';
import {JsonDataTable, MoexJsonResults} from 'src/moexapi/jsonresults/MoexJsonResults';
import {now} from 'src/util/DateUtil';

const COL_SEC_ID = 'SECID';
const COL_MAT_DATE = 'MATDATE';

/**
 * Fetch bonds codes by collection name at specific page.
 */
export class BondsCollectionPageFetcher extends BaseFetcher {

  /**
   * Fetch bonds data by collection name
   * @param collectionName - collection name
   * @param start - start row number (from zero)
   * @param actualOnly - if true, returns not maturity date expired only
   */
  fetchBondsCollection(collectionName: string, start = 0, actualOnly = true): Promise<string[]> {
    const curDate = now(); //TODO T+2 mode support

    const url = this.buildUrl(`securitygroups/stock_bonds/collections/${collectionName}/securities`,
      {name: 'sort_order', value: COL_MAT_DATE},
      {name: 'sort_order_desc', value: 'desc'},
      {name: 'iss.only', value: 'securities'},
      {name: 'securities.columns', value: [COL_SEC_ID, COL_MAT_DATE].join(',')},
      {name: 'start', value: start.toString()});

    return this.fetch<BondsCollectionJson>(url).then(r => {
      const securities = new MoexJsonResults(r.securities);
      return securities.getValues(
        row => actualOnly ? row.get(COL_MAT_DATE) > curDate : true,
        row => row.get(COL_SEC_ID));
    })
  }
}

type BondsCollectionJson = {
  securities: JsonDataTable<string>
}
