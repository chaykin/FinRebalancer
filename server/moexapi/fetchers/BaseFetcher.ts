import axios from 'axios';

const BASE_URL = 'http://iss.moex.com';

export const COL_NAME = 'name';
export const COL_VALUE = 'value';

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

    return axios.get(urlStr)
      .then(r => r.data)
      .then((r: T) => r)
      .catch(r => {
        throw new Error(r);
      });
  }
}
