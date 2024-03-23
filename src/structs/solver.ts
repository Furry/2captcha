import {
    Base64String, CaptchaResult,
    CloudflareTurnstile,
    GeetestExtrasV3,
    GeetestExtrasV4,
    GenericObject, HCaptchaExtras, HCaptchaResult, ImageCaptchaExtras,
    LanguagePool,
    PendingCaptcha,
    PendingCaptchaStorage,
    ProxiedCaptchaExtras,
    RecaptchaV2Extras,
    RecaptchaV3Extras,
    Task,
    TurnstileDefault,
} from "../types.js";

import { toBase64, toQueryString } from "../utils/conversions.js";
import L, { Locale } from "../utils/locale.js";
import fetch, { isNode } from "../utils/platform.js";
import { NetError, SolverError } from "./error.js";

export class Solver {
    private _token: string;
    private _locale: Locale;

    private _pending: { [key: string]: PendingCaptchaStorage } = {};
    private _interval: number | null = null;
    private _userAgent = "2captchaNode / 4.0.0 - Node-Fetch (https://github.com/furry/2captcha)";
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

    private get api(): string {
        return "https://api.2captcha.com/createTask"
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
                "User-Agent": this._userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).catch(err => {
            throw new NetError(err, this._locale);
        })

        const json = await response.json();

        if (json.status == "0") {
            throw new SolverError(json.request, this._locale);
        } else {
            return json;
        }
    }

    /**
     * Registers a new task to the 2captcha API, queuing it for automatic polling.
     * @param body The v2 task to send to 2captcha. (https://2captcha.com/api-docs/text)
     * @returns none
     */
    protected async newTask(body: Task) {
        const response = await fetch(this.api, {
            method: "POST",
            headers: {
                "User-Agent": this._userAgent,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientKey: this._token,
                ...body
                // afil token here
            })
        }).catch(err => {
            throw new NetError(err, this._locale);
        })

        const json = await response.json();

        if (json.errorId == 0) {
            return json.taskId;
        } else {
            throw new SolverError(json.request, this._locale);
        }
    }


    /**
     * Gets a list of all pending captchas.
     * @returns A list of all pending captchas.
     */
    public getPending(): PendingCaptcha[] {
        const pendingCache: PendingCaptcha[] = [];

        // A shallow clone isn't enough, so they need to be iterated manually.
        for (const pending of Object.keys(this._pending)) {
            const c = this._pending[pending];
            pendingCache.push({
                startTime: c.startTime,
                captchaId: c.captchaId,
                polls: c.polls,
            })
        }

        return pendingCache;
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
     * Resolves all possible promises for outstanding captchas.
     */
    private async getSolutions(): Promise<void> {
        const pendingIds = Object.keys(this._pending);
        if (pendingIds.length == 0) {
            // remove the interval.
            clearInterval(this._interval as number);
            return;
        }

        // Captcha solutions from this endpoint are returned as a string seperated by a vertical bar. 
        // Eg. "263s2v|CAPCHA_NOT_READY|365312" and so on.
        const solutions = await this.get(this.out, {
            ...this.defaults, action: "get", ids: pendingIds.join(",")
        }).then((res) => res.request);

        solutions.split("|").forEach((state: string, index: number) => {
            const id = pendingIds[index];
            const captcha = this._pending[id];

            switch (state) {
                case "CAPCHA_NOT_READY":
                    // Increment the polls for the captcha by one.
                    captcha.polls++;
                    break;
                case "ERROR_CAPTCHA_UNSOLVABLE":
                    captcha.reject(new SolverError(state, this._locale));
                    delete this._pending[id];
                    break;
                default:
                    captcha.resolve({
                        id: id,
                        // Parse the JSON if it's valid, otherwise return the string.
                        data: (() => {
                            try {
                                return JSON.parse(state)
                            } catch (_) {
                                return state; }
                        })()
                    });
                    delete this._pending[id];
                    break;
            };
        });
    }

    /**
     * Registers a new captcha promise to the array of pending captchas, returning the promise
     * object that will be automatically resolved or rejected by the getSolutions() function.
     * @param captchaId The captcha ID to get the solution of.
     * @returns The resulting captcha promise.
     */
    private async registerPollEntry<T>(captchaId: string): Promise<CaptchaResult<T>> {
        const captchaPromiseObject: PendingCaptchaStorage = {
            startTime: Date.now(),
            captchaId: captchaId,
            polls: 0
        } as any;

        captchaPromiseObject.promise = new Promise<CaptchaResult<T>>((resolve, reject) => {
            // @ts-ignore
            captchaPromiseObject.resolve = resolve;
            captchaPromiseObject.reject = reject;
        });

        // Add the captcha to the pending list.
        this._pending[captchaId] = captchaPromiseObject;

        if (this._interval == null) {
            this._interval = setInterval(() => {
                this.getSolutions();
            }, 1000) as unknown as number;
        }

        // @ts-ignore
        return captchaPromiseObject.promise;
    }

    //////////////////////
    // SOLVING METHODDS //
    ////////////////////// 
    /**
     * Solves an image based captcha
     * @param image The image to solve.
     * @param extra  The extra data to send to the solver.
     * @returns Captcha result.
     */
    public async imageCaptcha(image: Base64String | Buffer, extras: ImageCaptchaExtras = {}): Promise<CaptchaResult<String>> {
        const cid = await this.newTask({
            task: {
                type: "ImageToTextTask",
                body: toBase64(image)
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a text based captcha
     * @param comment {String} The comment to solve.
     * @param language {LanguagePool} The locale to solve the captcha in.
     * @returns {CaptchaResult<DefaultCaptcha>}
     * @example
     * <Solver>.textCaptcha("What is the color of the sky?", "en").then((res) => {
     *   console.log(res.data);
     * })
     */
    public async textCaptcha(comment: string, language: LanguagePool = "en"): Promise<CaptchaResult<any>> {
        const cid = await this.newTask({
            task: {
                type: "TextCaptchaTask",
                comment: comment
            },
            languagePool: language
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a recaptchaV2 captcha.
     * @param sitekey {String} The google key to solve.
     * @param pageurl {String} URL of the page the captcha appears on.
     * @param proxied {Boolean} Whether to use a proxy to solve the captcha.
     * @param extra {RecaptchaV2Extras | ProxiedCaptchaExtras?} Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    public async recaptchaV2<T extends boolean>(
        sitekey: string, pageurl: string, 
        proxied: T = false as T,
        enterprise: boolean = false,
        extras: T extends false ? RecaptchaV2Extras : RecaptchaV2Extras | ProxiedCaptchaExtras)
        : Promise<CaptchaResult<String>> {

        const cid = await this.newTask({
            task: {
                type: enterprise ? (proxied ? "RecaptchaV2EnterpriseTask" : "RecaptchaV2EnterpriseTaskProxyless") 
                : (proxied ? "RecaptchaV2Task" : "RecaptchaV2TaskProxyless"),
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a recaptchaV3 captcha.
     * @param sitekey {String} The google key to solve.
     * @param pageurl {String} URL of the page the captcha appears on.
     * @param extra {RecaptchaV3Extras} Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    public async recaptchaV3(sitekey: string, pageurl: string, extras: RecaptchaV3Extras): Promise<CaptchaResult<RecaptchaV3Extras>> {
        const cid = await this.newTask({
            task: {
                type: "RecaptchaV3TaskProxyless",
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a hCaptcha captcha.
     * @param sitekey The sitekey to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    public async hcaptcha<T extends boolean>(
        sitekey: string, pageurl: string, 
        proxied: T = false as T, 
        extras: T extends true ? HCaptchaExtras : HCaptchaExtras | ProxiedCaptchaExtras)
        : Promise<CaptchaResult<HCaptchaResult>> {

        const cid = await this.newTask({
            task: {
                type: proxied ? "HCaptchaTask" : "HCaptchaTaskProxyless",
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a GeeTest captcha.
     * @param pageurl URL of the page the captcha appears on.
     * @param gt The gt key to solve.
     * @param challenge The challenge key to solve.
     * @param proxied Whether to use a proxy to solve the captcha.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    public async geetest(pageurl: string, gt: string, challenge: string, proxied = false, extra: GeetestExtrasV3 | GeetestExtrasV4) {
        const cid = await this.newTask({
            task: {
                type: proxied ? "GeeTestTask" : "GeeTestTaskProxyless",
                websiteURL: pageurl,
                gt: gt,
                challenge: challenge,
                ...extra
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a Turnstile captcha.
     * @param pageurl {String} URL of the page the captcha appears on.
     * @param sitekey {String} The key of the captcha
     * @param cloudflare {Boolean} If the captcha apperas on a cloudflare page.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extra {TurnstileDefault | CloudflareTurnstile? | ProxiedCaptchaExtras?}
     */
    public async turnstile<T extends boolean>(
        pageurl: string, 
        sitekey: string, 
        proxied: T = false as T,
        extra: T extends false ? TurnstileDefault : TurnstileDefault | ProxiedCaptchaExtras
    ) {
        const cid = await this.newTask({
            task: {
                type: proxied ? "TurnstileTask" : "TurnstileTaskProxyless",
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extra
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a Cloudflare Turnstile captcha.
     * @param pageurl {String} URL of the page the captcha appears on.
     * @param sitekey {String} The key of the captcha
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {CloudflareTurnstile | TurnstileDefault | ProxiedCaptchaExtras}
     */
    public async cloudflareTurnstile<T extends boolean>(
        pageurl: string, sitekey: string, 
        proxied: T = false as T, 
        extras: T extends true ? (CloudflareTurnstile | TurnstileDefault | ProxiedCaptchaExtras) : (CloudflareTurnstile | TurnstileDefault)
    ) {
        const cid = await this.newTask({
            task: {
                type: proxied ? "TurnstileTask" : "TurnstileTaskProxyless",
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }
}