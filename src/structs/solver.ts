import { AbsoluteFilePathString, Base64String, CaptchaResult, GenericObject, ImageCaptchaExtras } from "../types.js";
import { toBase64, toQueryString } from "../utils/conversions.js";
import L, { Locale } from "../utils/locale.js";
import fetch, { isNode } from "../utils/platform.js";

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

        return response.json();
    }

    private async post(url: string, query: GenericObject, body: string) {
        // console.log(body)
        const response = await fetch(url + toQueryString(query), {
            method: "POST",
            headers: {
                "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
            },
            body: body
        })

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

    public async getPingbackDomains(): Promise<string[]> {
        return await this.get(this.out, {
            ...this.defaults, action: "get_pingback"
        }).then(res => res.request ? res.request : []);
    }

    public async addPingbackDomain(domain: string): Promise<void> {
        return await this.get(this.out, {
            ...this.defaults, action: "add_pingback", addr: domain
        }).then(res => res.request);
    }

    //////////////////////
    // SOLVING METHODDS //
    ////////////////////// 
    public async imageCaptcha( image: Base64String | AbsoluteFilePathString | Buffer, extras: ImageCaptchaExtras): Promise<CaptchaResult> {
        const data = toBase64(image);

        return await this.post(this.in, {
            ...extras,
            ...this.defaults,
            method: "base64"
        }, JSON.stringify({body: data}));
    }
}