/*
    A file fill of generic utility functions.
*/

/**
 * Changes 0 and 1 falsy/truthy values into a boolean.
 * @private
 * @param input boolean or number
 */
export function castBool(input: boolean | number): 0 | 1 {
    if (input == false) return 0
    if (input == true) return 1
    if (input != 0 && input != 1) return 0
    else return input
}

/**
 * Constructs uri parameters from an object
 * @private
 * @param input The input object
 */
export function objectToURI(input: {[key: string]: string | number | boolean} | any): string {
    let res = "?"
    const keys = Object.keys(input)
    keys.forEach((key, index) => {
        res += encodeURIComponent(key) + "=" + encodeURIComponent(input[key])
        if (index + 1 != keys.length) res += "&"
    })
    return res
}

/**
 * Returns a promise that resolves after x ms
 * @private
 * @param ms time to sleep for
 */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}