const BASE_URL = 'http://iss.moex.com';

/**
 * Base fetcher - contains common logic for all fetchers
 */
export abstract class BaseFetcher {

  protected buildUrl(endpoint: string, ...args: { name: string, value: string }[]): URL {
    const url = new URL(`iss/${endpoint}.json`, BASE_URL);
    url.searchParams.append('iss.meta', 'off');
    args.forEach(arg => url.searchParams.append(arg.name, arg.value));

    return url;
  }

  protected fetch<T>(url: URL): Promise<T> {
    const urlStr = url.toString();

    //console.debug(`Fetching url: ${urlStr}`);
    return fetch(urlStr)
      .then(r => {
      //  console.debug(`Fetched url: ${urlStr}`);
        if (!r.ok) {
          throw new Error(r.statusText);
        }

        return r.json();
      }).then((r: T) => {
        return r;
      });
  }
}
