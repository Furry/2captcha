/**
 * Changes 0 and 1 falsy/truthy values into a boolean.
 * @private
 * @param input boolean or number
 */
export declare function castBool(input: boolean | number): 0 | 1;
/**
 * Constructs uri parameters from an object
 * @private
 * @param input The input object
 */
export declare function objectToURI(input: {
    [key: string]: string | number | boolean;
} | any): string;
/**
 * Returns a promise that resolves after x ms
 * @private
 * @param ms time to sleep for
 */
export declare function sleep(ms: number): Promise<unknown>;
//# sourceMappingURL=generic.d.ts.map