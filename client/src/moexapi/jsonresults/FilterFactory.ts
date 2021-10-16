import {DataRow} from 'src/moexapi/jsonresults/MoexJsonResults';

/**
 * Factory creates some useful filters
 */
export class FilterFactory {

  /**
   * Filter for single row, than filtered by specific value in specific column
   */
  public static createByColFilter<T>(colName: string, colValue: T): (row: DataRow<T>) => boolean {
    return (row: DataRow<T>) => row.get(colName) === colValue;
  }
}
