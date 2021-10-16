export class PromiseUtil {
  public static allSettled<T>(promises: Promise<T>[]): Promise<PromiseSettledResult<T>[]> {
    const results = Array(promises.length);
    let counter = 0;

    return new Promise(resolve => {
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then(result => {
            results[index] = {status: PromiseResult.FULFILLED, value: result};

            if (++counter === promises.length) {
              resolve(results);
            }
          })
          .catch(e => {
            const error = e instanceof Error ? e : new Error(JSON.stringify(e));

            results[index] = {status: PromiseResult.REJECTED, reason: error};

            if (++counter === promises.length) {
              resolve(results);
            }
          })
      });
    });
  }
}

export enum PromiseResult {
  FULFILLED,
  REJECTED
}

export type PromiseSettledResult<T> = { status: PromiseResult, value?: T, reason?: Error }
