import { Security } from 'src/finance/Security';

export class SecurityFetcher {
  private static BASE_URL = 'http://iss.moex.com/iss/';

  constructor(private readonly code: string) {
  }

  fetchSecurity(): Promise<Security> {
    const securityInfoUrl = this.buildSecurityInfoUrl();

    return this.fetch<SecurityInfoJson>(securityInfoUrl).then(si => {
      const securityPriceUrls = this.buildSecurityPriceUrls(si.boards);

      return this.fetchPriceData(securityPriceUrls, 0).then(sp => {
        let price = SecurityFetcher.getData(sp.marketdata, 'WAPRICE');
        if (price == undefined) {
          price = SecurityFetcher.getData(sp.marketdata, 'LAST');
          if (price == undefined) {
            throw new Error(`Could not fetch price for security ${this.code}`);
          }
        }

        const shortName = SecurityFetcher.getSecurityInfoData(si, 'SHORTNAME');
        const fullName = SecurityFetcher.getSecurityInfoData(si, 'NAME');
        const faceValue = SecurityFetcher.getSecurityInfoData(si, 'FACEVALUE');
        const priceValue = price * (faceValue ? Number(faceValue) / 100.0 : 1);

        return new Security(this.code, shortName, fullName, priceValue);
      });
    });
  }

  private fetchPriceData(securityPriceUrls: string[], index: number): Promise<SecurityPriceJson> {
    if (securityPriceUrls.length <= index) {
      throw new Error(`Index too large for: ${securityPriceUrls.toString()}`);
    }
    return this.fetch<SecurityPriceJson>(securityPriceUrls[index]).then(sp => {
      if (!sp.marketdata.data.length) {
        return this.fetchPriceData(securityPriceUrls, ++index);
      }

      return sp;
    });
  }

  private static getData<T>(data: { columns: string[], data: [T[]] }, colName: string): T {
    return data.data[0][data.columns.indexOf(colName)];
  }

  private static getAllData<T>(data: { columns: string[], data: [T[]] }, colName: string): T[] {
    const index = data.columns.indexOf(colName);
    return data.data.map(d => d[index]);
  }

  private static getSecurityInfoData(si: SecurityInfoJson, colName: string): string {
    const nameIndex = si.description.columns.indexOf('name');
    const valueIndex = si.description.columns.indexOf('value');
    const row = si.description.data.filter(d => d[nameIndex] == colName);
    return row.length > 0 ? row[0][valueIndex] : '';
  }

  private fetch<T>(url: string): Promise<T> {
    console.debug(`Fetching url: ${url}`);
    return fetch(url)
      .then(r => {
        console.debug(`Fetched url: ${url}`);
        console.debug(r);
        if (!r.ok) {
          throw new Error(r.statusText);
        }

        return r.json();
      }).then((r: T) => {
        return r;
      });
  }

  private buildSecurityInfoUrl() {
    return `${SecurityFetcher.BASE_URL}securities/${this.code}.json?columns=name,value&boards.columns=engine,market,boardid`;
  }

  private buildSecurityPriceUrls(boardsInfo: { columns: string[], data: [string[]] }) {
    const engines = SecurityFetcher.getAllData(boardsInfo, 'engine');
    const markets = SecurityFetcher.getAllData(boardsInfo, 'market');
    const boardIds = SecurityFetcher.getAllData(boardsInfo, 'boardid');

    const urls = [];
    for (let i = 0; i < engines.length; i++) {
      urls.push(`${SecurityFetcher.BASE_URL}engines/${engines[i]}/markets/${markets[i]}/boards/${boardIds[i]}/securities/${this.code}.json?iss.only=marketdata&marketdata.columns=WAPRICE,LAST`);
    }
    return urls;
  }
}


type SecurityInfoJson = { description: { columns: string[], data: [string[]] }, boards: { columns: string[], data: [string[]] } }
type SecurityPriceJson = { marketdata: { columns: string[], data: [(number | undefined | null)[]] } }
