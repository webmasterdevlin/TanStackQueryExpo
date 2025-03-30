/**
 * Utility functions for API related operations
 */

/**
 * Creates a promise that resolves after the specified timeout
 * Similar to RxJS's delay operator but implemented with Promise
 * @param ms The delay in milliseconds
 * @returns A Promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Usage example:
 *
 * // In an async function
 * async function myDemoFunction() {
 *   console.log('Starting demo');
 *   await delay(2000); // Wait for 2 seconds
 *   console.log('After 2 second delay');
 * }
 *
 * // Or with Promise chains
 * someAsyncOperation()
 *   .then(() => delay(1000))
 *   .then(() => console.log('Executed after 1 second'));
 */
