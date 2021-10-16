/**
 * Base class for support iterate by pages in sequenced requests
 */
export abstract class FetchPager<T, R> {

  public fetch(): Promise<R> {
    return this.doFetch(this.nextPagePromise(undefined));
  }

  protected abstract nextPagePromise(page: T | undefined): Promise<T>;

  protected abstract hasNextPage(page: T): boolean;

  protected abstract thenPage(page: T): void;

  protected abstract all(): Promise<R>;

  private doFetch(promise: Promise<T>): Promise<R> {
    return promise.then(page => {
      this.thenPage(page);

      if (this.hasNextPage(page)) {
        return this.doFetch(this.nextPagePromise(page));
      } else {
        return this.all();
      }
    });
  }
}
