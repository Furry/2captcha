import { GenericObject } from "../types.js";
import { toQueryString } from "../utils/conversions.js";
import L, { Locale } from "../utils/locale.js";
import fetch from "../utils/fetch.js";

export class Solver {
    private _token: string;
    private _locale: Locale;

    constructor(token: string, locale: Locale = "en") {
        this._token = token;
        this._locale = locale;
    }

    /////////////
    // GETTERS //
    ///////////// 
    public get token(): string {
        return this._token;
    }

    public get in(): string {
        return L[this._locale].domain + "/in.php";
    }

    public get out(): string {
        return L[this._locale].domain + "/res.php";
    }

    public get defaults(): GenericObject {
        return {
            key: this._token,
            json: 1
        };
    }

    /////////////////////
    // Utility Methods //
    /////////////////////
    public async get(url: string, query: GenericObject) {
        const response = await fetch(url + toQueryString(query), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return response.json();
    }

    /**
     * Get the balance of the account.
     */
    public async balance(): Promise<number> {
        return await this.get(this.out, {
            ...this.defaults, action: "getbalance"
        }).then(res => res.request) as number;
    }

    // Default Methods
}