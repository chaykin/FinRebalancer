import {Security} from 'src/finance/Security';
import {BriefSecurityInfoFetcher} from 'src/moexapi/fetchers/BriefSecurityInfoFetcher';
import {SecurityMarketdataFetcher} from 'src/moexapi/fetchers/SecurityMarketdataFetcher';
import {SecurityBondizationFetcher} from 'src/moexapi/fetchers/SecurityBondizationFetcher';
import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';

/**
 * Fetch full security info by code. It includes as constant fields (boardId/market/etc) as frequently changes fields (price/coupon/etc).
 */
export class SecurityFetcher extends BaseFetcher {

  public fetchSecurity(code: string, needBondization: boolean): Promise<Security> {
    let bondizationPromise = new Promise<number>((resolve) => resolve(0));
    if (needBondization) {
      bondizationPromise = new SecurityBondizationFetcher().fetchBondization(code);
    }

    const securityInfoPromise = new BriefSecurityInfoFetcher().fetchBriefSecurityInfo(code).then(briefInfo => {
      const marketdataPromise = new SecurityMarketdataFetcher().fetchMarketdata(briefInfo);
      return marketdataPromise.then(marketdata => ({briefInfo: briefInfo, marketdata: marketdata}));
    })

    return Promise.all([bondizationPromise, securityInfoPromise]).then(r => {
      const bondization = r[0];
      const securityInfo = r[1];

      const price = securityInfo.marketdata.price;
      const accruedInt = securityInfo.marketdata.accruedInt

      return new Security(securityInfo.briefInfo, price, accruedInt, bondization);
    })
  }
}
