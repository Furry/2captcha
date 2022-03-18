import { AbsoluteFilePathString, Base64String, CaptchaResult, GenericObject, ImageCaptchaExtras } from "../types.js";
import { toBase64, toQueryString } from "../utils/conversions.js";
import L, { Locale } from "../utils/locale.js";
import fetch, { isNode } from "../utils/platform.js";
import { SolverError } from "./error.js";

export class Solver {
    private _token: string;
    private _locale: Locale;
    private _pending: { [key: string]: Promise<CaptchaResult> } = {};
    // private _pending: string[] = [];

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

    private get in(): string {
        return L[this._locale].domain + "/in.php";
    }

    private get out(): string {
        return L[this._locale].domain + "/res.php";
    }

    private get defaults(): GenericObject {
        return {
            key: this._token,
            json: 1
        };
    }


    /////////////////////
    // Utility Methods //
    /////////////////////
    private async get(url: string, query: GenericObject) {
        const response = await fetch(url + toQueryString(query), {
            method: "GET",
            headers: {
                "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const json = await response.json();

        if (json.status == "0") {
            throw new SolverError(json.request, this._locale);
        } else {
            return json;
        }
    }

    private async post(url: string, query: GenericObject, body: string) {
        const response = await fetch(url + toQueryString(query), {
            method: "POST",
            headers: {
                "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
            },
            body: body
        })

        const json = await response.json();

        if (json.status == "0") {
            throw new SolverError(json.request, this._locale);
        } else {
            return json;
        }
    }

    /**
     * Get the balance of the account.
     * 
     * @returns {Promise<number>} The current balance.
     */
    public async balance(): Promise<number> {
        return await this.get(this.out, {
            ...this.defaults, action: "getbalance"
        }).then(res => res.request) as number;
    }

    /**
     * Gets all registered Pingback Domains
     * @returns {Promise<PingbackDomain[]>} The domains
     */
    public async getPingbackDomains(): Promise<string[]> {
        return await this.get(this.out, {
            ...this.defaults, action: "get_pingback"
        }).then(res => res.request ? res.request : []);
    }

    /**
     * Registers a new pingback domain to the account.
     * @param domain The domain to add
     * @returns {Promise<boolean>} Whether the domain was added. 
     */
    public async addPingbackDomain(domain: string): Promise<boolean> {
        return await this.get(this.out, {
            ...this.defaults, action: "add_pingback", addr: domain
        }).then(res => res.request);
    }

    /**
     * Determines the current price of a solved captcha.
     * @param captchaId The captcha ID to find the fee of.
     * @returns {Promise<number>} The fee of the captcha type.
     */
    public async priceOfCaptcha(captchaId: string): Promise<number> {
        return await this.get(this.out, {
            ...this.defaults, action: "get2", id: captchaId
        }).then(res => res.request);
    }

    /**
     * Gets the solution for multiple captchas.
     * @param captchaIds The captcha IDs to solve.
     * @returns {Promise<CaptchaResult[]>} The solved captchas.
     */
    private async getSolutions(captchaIds: string[]): Promise<CaptchaResult[]> {
        const solutions = await this.get(this.out, {
            ...this.defaults, action: "get", ids: captchaIds.join(",")
        }).then((res) => res.request);

        console.log(solutions);
        return [];
    }

    private async registerPollEntry(captchaId: string): Promise<CaptchaResult> {
        // add a new pending promise to the map that will never resulve.
        this._pending[captchaId] = new Promise<CaptchaResult>((resolve, reject) => {});
        return this._pending[captchaId];
    }

    //////////////////////
    // SOLVING METHODDS //
    ////////////////////// 
    public async imageCaptcha( image: Base64String | Buffer, extras: ImageCaptchaExtras): Promise<CaptchaResult> {
        const data = toBase64(image);

        const c = await this.post(this.in, {
            ...extras,
            ...this.defaults,
            method: "base64"
        }, JSON.stringify({body: data}));

        return this.registerPollEntry(c.request);
    }
}