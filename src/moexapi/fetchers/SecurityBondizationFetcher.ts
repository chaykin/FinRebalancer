import {JsonDataTable, MoexJsonResults} from 'src/moexapi/jsonresults/MoexJsonResults';
import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';
import {now} from 'src/util/DateUtil';

const COL_COUPON_DATE = 'coupondate';
const COL_VALUE = 'value';

/**
 * Fetch security bondization data (future coupons)
 */
export class SecurityBondizationFetcher extends BaseFetcher {

  public fetchBondization(code: string): Promise<number> {
    const url = this.buildUrl(
      `securities/${code}/bondization`,
      {name: 'iss.only', value: 'coupons'},
      {name: 'coupons.columns', value: [COL_COUPON_DATE, COL_VALUE].join(',')},
      {name: 'limit', value: 'unlimited'});

    return this.fetch<SecurityBondizationInfoJson>(url)
      .then(r => {
        const curDate = now(); //TODO T+2 mode support
        const bondization = new MoexJsonResults(r.coupons);
        const values = bondization.getValues(
          row => row.get(COL_COUPON_DATE) > curDate,
          row => <number>row.get(COL_VALUE));
        return values.reduce((pv, cv) => pv + cv, 0);
      });
  }

  private static now(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toJSON().slice(0, 10);
  }
}

type SecurityBondizationInfoJson = {
  coupons: JsonDataTable<string | number>
}
