import PortfolioListFetcher from 'src/backendapi/PortfolioListFetcher';

export default class BackendDataProvider {

  fetchPortfolioList(): Promise<{ code: string, name: string }[]> {
    return new PortfolioListFetcher().fetchPortfolioList();
  }
}
