/**
 * Results, fetched from MOEX and methods to extract them
 */
export class MoexJsonResults<T> {
  private readonly rawData: JsonDataTable<T>;
  private columns: Map<string, number> | undefined;

  constructor(rawData: JsonDataTable<T>) {
    this.rawData = rawData;
  }

  public getValues<R>(rowsFilter: (row: DataRow<T>) => boolean, valueResolver: (row: DataRow<T>) => R): R[] {
    const values = [];
    for (let i = 0; i < this.rawData.data.length; i++) {
      const row = this.createRow(this.rawData.data[i]);
      if (rowsFilter(row)) {
        values.push(valueResolver(row));
      }
    }

    return values;
  }

  public getSingleValue<R>(rowsFilter: (row: DataRow<T>) => boolean, valueResolver: (row: DataRow<T>) => R): R | undefined {
    for (let i = 0; i < this.rawData.data.length; i++) {
      const row = this.createRow(this.rawData.data[i]);
      if (rowsFilter(row)) {
        return valueResolver(row);
      }
    }
  }

  private getColumns(): Map<string, number> {
    if (!this.columns) {
      this.columns = new Map(this.rawData.columns.map((v, i) => [v, i]));
    }
    return this.columns;
  }

  private createRow(rawRow: T[]): DataRow<T> {
    return new DataRow<T>(this.getColumns(), rawRow);
  }
}

export class DataRow<T> {
  private readonly row: Map<string, T>

  constructor(columns: Map<string, number>, rawRow: T[]) {
    this.row = new Map<string, T>();
    for (const [key, value] of columns) {
      this.row.set(key, rawRow[value]);
    }
  }

  public get(colName: string): T {
    const value = this.getOrUndefined(colName);
    if (value === undefined) {
      throw new Error(`No cell for name ${colName} in row ${JSON.stringify(this.row)}`)
    }

    return value;
  }

  public getOrUndefined(colName: string): T | undefined {
    return this.row.get(colName);
  }
}

export type JsonDataTable<T> = { columns: string[], data: [T[]] }
