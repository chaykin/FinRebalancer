import { MoexJsonResults } from '../../moexapi/jsonresults/MoexJsonResults';
import { Board } from '../../model/Board';
import { FilterFactory } from '../../moexapi/jsonresults/FilterFactory';
import { Security } from '.prisma/client';
import PrismaMan from '../../prisma/PrismaMan';
import { COL_NAME, COL_VALUE } from '../../moexapi/fetchers/BaseFetcher';

const SHORT_NAME_VAL = 'SHORTNAME';
const FULL_NAME_VAL = 'NAME';
const TYPE_NAME_VAL = 'TYPENAME';

export default class SecurityCreator {

  public createOrUpdate(code: string, group: string, data: { description: MoexJsonResults<string>, board: Board }): Promise<Security> {
    const prisma = PrismaMan.getPrisma();
    const security = this.mapToSecurity(code, group, data);

    return prisma.security.upsert({
      create: security,
      update: security,
      where: { code: code }
    });
  }

  protected extractField(jsonResults: MoexJsonResults<string>, fieldName: string): string {
    const filter = FilterFactory.createByColFilter(COL_NAME, fieldName);
    return jsonResults.getSingleValue(filter, row => row.get(COL_VALUE));
  }

  private mapToSecurity(code: string, group: string, data: { description: MoexJsonResults<string>, board: Board }): Security {
    return {
      code: code,
      shortName: this.extractField(data.description, SHORT_NAME_VAL),
      fullName: this.extractField(data.description, FULL_NAME_VAL),
      boardId: data.board.boardId,
      market: data.board.market,
      engine: data.board.engine,
      currencyId: data.board.currencyId,
      type: this.extractField(data.description, TYPE_NAME_VAL),
      group: group
    };
  }
}