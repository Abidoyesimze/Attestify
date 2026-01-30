/**
 * Sleep utility - delay execution for a specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Delay execution and return a value
 */
export async function delay<T>(ms: number, value?: T): Promise<T | undefined> {
  await sleep(ms);
  return value;
}

