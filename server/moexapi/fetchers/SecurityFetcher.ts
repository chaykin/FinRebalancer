import { BaseFetcher, COL_NAME, COL_VALUE } from './BaseFetcher';
import { JsonDataTable, MoexJsonResults } from '../jsonresults/MoexJsonResults';
import { FilterFactory } from '../jsonresults/FilterFactory';
import { Board } from '../../model/Board';

export const BOARD_COL_BOARD_ID = 'boardid';
export const BOARD_COL_MARKET = 'market';
export const BOARD_COL_ENGINE = 'engine';
export const BOARD_COL_IS_PRIMARY = 'is_primary';
export const BOARD_COL_CURRENCY_ID = 'currencyid';

const IS_PRIMARY_VAL = 1;

const DESCR_COLS = [COL_NAME, COL_VALUE];
const BOARDS_COLS = [BOARD_COL_BOARD_ID, BOARD_COL_MARKET, BOARD_COL_ENGINE, BOARD_COL_IS_PRIMARY, BOARD_COL_CURRENCY_ID];

/**
 * Fetch security info by code
 */
export class SecurityFetcher extends BaseFetcher {

  public fetchSecurity(code: string): Promise<{ description: MoexJsonResults<string>, board: Board }> {
    const url = this.buildUrl(`securities/${code}`,
      { name: 'description.columns', value: DESCR_COLS.join(',') },
      { name: 'boards.columns', value: BOARDS_COLS.join(',') });

    return this.fetch<SecurityJson>(url)
      .then(r => {
        const descrResults = new MoexJsonResults(r.description);
        const boardResults = new MoexJsonResults(r.boards);

        const boardFilter = FilterFactory.createByColFilter(BOARD_COL_IS_PRIMARY, <string | number>IS_PRIMARY_VAL);
        const board = boardResults.getSingleValue(boardFilter, row => ({
          boardId: <string>row.get(BOARD_COL_BOARD_ID),
          market: <string>row.get(BOARD_COL_MARKET),
          engine: <string>row.get(BOARD_COL_ENGINE),
          currencyId: <string>row.get(BOARD_COL_CURRENCY_ID)
        }));
        if (board === undefined) {
          throw new Error(`Could not fetch security by code ${code}`);
        }

        return { description: descrResults, board: board };
      });
  }
}

type SecurityJson = {
  description: JsonDataTable<string>,
  boards: JsonDataTable<string | number>
}