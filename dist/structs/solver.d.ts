import { GenericObject } from "../types.js";
import { Locale } from "../utils/locale.js";
export declare class Solver {
    private _token;
    private _locale;
    constructor(token: string, locale?: Locale);
    get token(): string;
    get in(): string;
    get out(): string;
    get defaults(): GenericObject;
    get(url: string, query: GenericObject): Promise<any>;
    /**
     * Get the balance of the account.
     */
    balance(): Promise<number>;
}
//# sourceMappingURL=solver.d.ts.map