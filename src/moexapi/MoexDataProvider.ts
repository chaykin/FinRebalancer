import {Security} from 'src/finance/Security';
import {SecurityFetcher} from 'src/moexapi/fetchers/SecurityFetcher';

/**
 * Json Data Provider for MOEX stock exchange
 */
export class MoexDataProvider {

  /**
   * Fetch security by code
   */
  fetchSecurity(code: string, needBondization = false): Promise<Security> {
    return new SecurityFetcher().fetchSecurity(code, needBondization);
  }

}
