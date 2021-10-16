import {Security} from 'src/finance/Security';
import {BaseFetcher} from 'src/moexapi/fetchers/BaseFetcher';
import {BondsCollectionPageFetcher} from 'src/moexapi/fetchers/BondsCollectionPageFetcher';
import {FetchPager} from 'src/moexapi/pager/FetchPager';
import {SecurityFetcher} from 'src/moexapi/fetchers/SecurityFetcher';

const COLLECTION_BONDS = 'stock_bonds_all';
const COLLECTION_EUROBONDS = 'stock_eurobond_all'

/**
 * Fetch from MOEX all bonds securities
 */
export class BondsSecurityFetcher extends BaseFetcher {

  fetchBonds(): Promise<Promise<Security>[]> {
    const bondsPageFetcher = new BondsCollectionPageFetcher();

    const bondsColPromise = new BondsCollectionFetchPager(COLLECTION_BONDS, bondsPageFetcher).fetch();
    const euroBondsColPromise = new BondsCollectionFetchPager(COLLECTION_EUROBONDS, bondsPageFetcher).fetch();

    return Promise.all([bondsColPromise, euroBondsColPromise]).then(r => [...r[0], ...r[1]]);
  }
}

class BondsCollectionFetchPager extends FetchPager<string[], Promise<Security>[]> {
  private readonly collectionName: string;
  private readonly bondsPageFetcher: BondsCollectionPageFetcher;
  private securityPromises: Promise<Security>[] = [];

  private start = 0;

  constructor(collectionName: string, bondsPageFetcher: BondsCollectionPageFetcher) {
    super();

    this.collectionName = collectionName;
    this.bondsPageFetcher = bondsPageFetcher;
  }

  protected nextPagePromise(page: string[] | undefined): Promise<string[]> {
    this.start += page ? page.length : 0;
    return this.bondsPageFetcher.fetchBondsCollection(this.collectionName, this.start);
  }

  protected hasNextPage(page: string[]): boolean {
    return page.length > 0;
  }

  protected thenPage(page: string[]): void {
    this.securityPromises.push(...page.map(c => new SecurityFetcher().fetchSecurity(c, true)));
  }

  protected all(): Promise<Promise<Security>[]> {
    return new Promise(resolve => resolve(this.securityPromises));
  }
}

