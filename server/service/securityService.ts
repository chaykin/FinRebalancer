import {   SecurityFetcher } from '../moexapi/fetchers/SecurityFetcher';
import { FilterFactory } from '../moexapi/jsonresults/FilterFactory';
import SecurityCreator from './creator/securityCreator';
import { Security } from '.prisma/client';
import BondCreator from './creator/bondCreator';
import { COL_NAME, COL_VALUE } from '../moexapi/fetchers/BaseFetcher';

export const GROUP_VAL = 'GROUP';

export default class SecurityService {

  public createOrUpdateSecurity(code: string): Promise<Security> {
    return new SecurityFetcher().fetchSecurity(code).then(r => {
      const filter = FilterFactory.createByColFilter(COL_NAME, GROUP_VAL);
      const group = r.description.getSingleValue(filter, row => row.get(COL_VALUE));

      if (group === 'stock_bonds') {
        return new BondCreator().createOrUpdate(code, group, r);
      } else {
        return new SecurityCreator().createOrUpdate(code, group, r);
      }
    });
  }
}