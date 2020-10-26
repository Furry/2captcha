/**
 * Returns a promise that resolves after 'ms' miliseconds
 * @param ms Miliseconds to sleep for
 */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}