/**
 * Base fetcher - contains common logic for all fetchers
 */
export abstract class BaseFetcher {

  protected buildUrl(endpoint: string, ...args: { name: string, value: string }[]): URL {
    const baseUrl = process.env.API_URL;
    const url = new URL(`api/${endpoint}`, baseUrl);
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
