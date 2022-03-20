import { 
    Base64String, CaptchaResult, FunCaptchaExtras, GeetestExtras, 
    GenericObject, HCaptchaExtras, ImageCaptchaExtras, 
    KeyCaptchaExtras, 
    RecaptchaV2Extras, 
    RecaptchaV3Extras, 
    RotateCaptchaExtras} from "../types.js";
import { toBase64, toQueryString } from "../utils/conversions.js";
import L, { Locale } from "../utils/locale.js";
import fetch, { isNode } from "../utils/platform.js";
import { SolverError } from "./error.js";

export class Solver {
    private _token: string;
    private _locale: Locale;
    private _pending: { [key: string]: Promise<CaptchaResult> } = {};

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
    public async imageCaptcha(image: Base64String | Buffer, extra: ImageCaptchaExtras = {}): Promise<CaptchaResult> {
        const data = toBase64(image);

        const c = await this.post(this.in, {
            ...extra,
            ...this.defaults,
            method: "base64"
        }, JSON.stringify({body: data}));

        return this.registerPollEntry(c.request);
    }
    // An alias for ImageCaptcha
    public async textCaptcha(image: Base64String | Buffer, extra: ImageCaptchaExtras = {}): Promise<CaptchaResult> {
        return this.imageCaptcha(image, extra); }

    public async recaptchaV2(googlekey: string, pageurl: string, extra: RecaptchaV2Extras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            googlekey: googlekey,
            pageurl: pageurl
        });

        return this.registerPollEntry(c.request);
    }

    public async hcaptcha(sitekey: string, pageurl: string, extra: HCaptchaExtras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "hcaptcha",
            pageurl: pageurl,
            sitekey: sitekey
        });

        return this.registerPollEntry(c.request);
    }

    public async geetest(gt: string, challenge: string, pageurl: string, extra: GeetestExtras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "geetest",
            gt: gt,
            challenge: challenge,
            pageurl: pageurl
        });

        return this.registerPollEntry(c.request);
    }

    public async funCaptcha(publickey: string, pageurl: string, serviceurl?: string, extra: FunCaptchaExtras = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "funcaptcha",
            publickey: publickey,
            pageurl: pageurl,
            // Spread the serviceurl if it exists into the object.
            ...(serviceurl ? { surl: serviceurl } : {})
        });

        return this.registerPollEntry(c.request);
    }

    public async rotateCaptcha(image: Base64String | Buffer, angle: number = 40, extra: RotateCaptchaExtras): Promise<CaptchaResult> {
        const data = toBase64(image);
        const c = await this.post(this.in, {
            ...extra,
            ...this.defaults,
            method: "rotatecaptcha",
            angle: angle,
        }, JSON.stringify({body: data}));

        return this.registerPollEntry(c.request);
    }

    public async keyCaptcha(
        sscUserId: string, sscSessionId: string,
        sscWebserverSign: string, sscWebserverSign2: string,
        pageurl: string, extra: KeyCaptchaExtras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "keycaptcha",
            s_s_c_user_id: sscUserId,
            s_s_c_session_id: sscSessionId,
            s_s_c_web_server_sign: sscWebserverSign,
            s_s_c_web_server_sign2  : sscWebserverSign2,
            pageurl: pageurl
        });

        return this.registerPollEntry(c.request);
    }

    public async recaptchaV3(sitekey: string, pageurl: string, extra: RecaptchaV3Extras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            version: "v3",
            sitekey: sitekey,
            pageurl: pageurl
        });

        return this.registerPollEntry(c.request);
    }

    public async recaptchaEnterprise(sitekey: string, pageurl: string, extra: RecaptchaV3Extras = {}): Promise<CaptchaResult> {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            version: "v3",
            enterprise: "1",
            sitekey: sitekey,
            pageurl: pageurl
        });

        return this.registerPollEntry(c.request);
    }
}
