import { BaseFetcher } from 'src/backendapi/BaseFetcher';

export default class PortfolioListFetcher extends BaseFetcher {

  public fetchPortfolioList(): Promise<{ code: string, name: string }[]> {
    const url = this.buildUrl('portfolio/portfolios');
    return this.fetch<{ code: string, name: string }[]>(url);
  }
}
