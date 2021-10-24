import { BaseFetcher, COL_VALUE } from './BaseFetcher';
import { Board } from '../../model/Board';
import { formattedDate } from '../../service/currentDateService';
import { JsonDataTable, MoexJsonResults } from '../jsonresults/MoexJsonResults';

const COL_COUPON_DATE = 'coupondate';

/**
 * Fetch bondization data (future bond coupons)
 */
export class BondizationFetcher extends BaseFetcher {

  public fetchBondization(code: string, board: Board): Promise<number> {
    const url = this.buildUrl(
      `securities/${code}/bondization`,
      { name: 'iss.only', value: 'coupons' },
      { name: 'coupons.columns', value: [COL_COUPON_DATE, COL_VALUE].join(',') },
      { name: 'limit', value: 'unlimited' });

    return this.fetch<BondizationJson>(url)
      .then(r => {
        const cutDate = formattedDate(board);
        const bondization = new MoexJsonResults(r.coupons);
        const values = bondization.getValues(
          row => row.get(COL_COUPON_DATE) > cutDate,
          row => <number>row.get(COL_VALUE));
        return values.reduce((pv, cv) => pv + cv, 0);
      });
  }

}

type BondizationJson = {
  coupons: JsonDataTable<string | number>
}
