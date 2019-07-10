/**
 * Returns a promise that is resolved in `timeout` seconds.
 *
 * @param timeout Timeout in seconds.
 */
export const resolveAfterTimeout = (timeout: number) => {
  return new Promise(resolve => window.setTimeout(resolve, timeout * 1000));
};
