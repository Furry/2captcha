import {
    AmazonCaptchaResult,
    AmazonTaskExtras,
    Base64String, CaptchaResult,
    CapyTaskExtras,
    CapyTaskResult,
    CloudflareTurnstile,
    DataDomeCaptchaResult,
    DataDomeExtras,
    GeetestExtrasV3,
    GeetestExtrasV4,
    GeetestResult,
    GenericObject, HCaptchaExtras, HCaptchaResult, ImageCaptchaExtras,
    KeyCaptcha,
    LanguagePool,
    LeminCaptchaResult,
    LeminTaskExtras,
    PendingCaptcha,
    PendingCaptchaStorage,
    ProxiedCaptchaExtras,
    RecaptchaV2Extras,
    RecaptchaV3Extras,
    SingleTokenResult,
    Task,
    TurnstileDefault,
    TurnstileResult,
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
    public async geetest(pageurl: string, gt: string, challenge: string, proxied = false, extra: GeetestExtrasV3 | GeetestExtrasV4): Promise<CaptchaResult<GeetestResult>> {
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
    ): Promise<CaptchaResult<TurnstileResult>> {
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
    ): Promise<CaptchaResult<TurnstileResult>> {
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

    /**
     * Solves a Capy Puzzle Captcha.
     * @param pageurl {String} The URL of the page the captcha appears on.
     * @param sitekey {String} The key of the captcha.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {CapyTaskExtras | ProxiedCaptchaExtras?}
     */
    public async capypuzzle<T extends boolean>(
        pageurl: string, sitekey: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras | CapyTaskExtras : CapyTaskExtras 
    ): Promise<CaptchaResult<CapyTaskResult>> {
        const cid = await this.newTask({
            task: {
                type: proxied ? "CapyTask" : "CapyTaskProxyless",
                websiteURL: pageurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a KeyCaptcha.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {KeyCaptcha | ProxiedCaptchaExtras?}
     */
    public async keycaptcha<T extends boolean>(
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras | KeyCaptcha : KeyCaptcha
    ): Promise<CaptchaResult<KeyCaptcha>> {
        const cid = await this.newTask({
            task: {
                type: proxied ? "KeyCaptchaTask" : "KeyCaptchaTaskProxyless",
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a Lemin Puzzle Captcha.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {LeminTaskExtras | ProxiedCaptchaExtras?}
     */
    public async leminPuzzle<T extends boolean>(
        siteurl: string, captchaId: string, divId: string,
        proxied: T = false as T,
        extras: T extends true ? LeminTaskExtras | ProxiedCaptchaExtras : LeminTaskExtras
    ): Promise<CaptchaResult<LeminCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                websiteURL: siteurl,
                captchaId: captchaId,
                divId: divId,
                type: proxied ? "LeminTask" : "LeminTaskProxyless",
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves an Amazon Captcha.
     * @param siteurl {String} The full URL of the target web page.
     * @param sitekey {String} The key paramater found on the page.
     * @param iv {String} The value of iv paramater found on the page.
     * @param context {String} The context of the captcha.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {AmazonTaskExtras | ProxiedCaptchaExtras?}
     */
    public async amazonCaptcha<T extends boolean>(
        siteurl: string, sitekey: string,
        iv: string, context: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : AmazonTaskExtras | AmazonTaskExtras
    ): Promise<CaptchaResult<AmazonCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                type: proxied ? "AmazonTask" : "AmazonTaskProxyless",
                websiteURL: siteurl,
                websiteKey: sitekey,
                iv: iv,
                context: context,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a CyberSiARA captcha.
     * @param siteurl {String} The full URL of the target web page.
     * @param masterurlid {String} The SlideMasterUrlId found on the page.
     * @param userAgent {String} The user agent to use when solving the captcha.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {ProxiedCaptchaExtras?}
     */
    public async cyberSiARA<T extends boolean>(
        siteurl: string, masterurlid: string, userAgent: string, 
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {}
    ): Promise<CaptchaResult<SingleTokenResult>> {
        const cid = await this.newTask({
            task: {
                type: proxied ? "AntiCyberSiAraTask" : "AntiCyberSiAraTaskProxyless",
                websiteURL: siteurl,
                SlideMasterUrlId: masterurlid,
                userAgent: userAgent,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a MTCaptcha.
     * @param siteurl {String} The full URL of target page where the captcha is shown..
     * @param sitekey {String} The sitekey found  found on the page.
     * @param surl {String} The sitekey value found in the page's code.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {ProxiedCaptchaExtras?}
     */
    public async mtCaptcha<T extends boolean>(
        siteurl: string, sitekey: string, 
        proxed: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {}
    ): Promise<CaptchaResult<SingleTokenResult>> {
        const cid = await this.newTask({
            task: {
                type: proxed ? "MTCaptchaTask" : "MTCaptchaTaskProxyless",
                websiteURL: siteurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a CutCaptcha
     * @param siteurl {String} The full URL of the target page where the captcha is shown.
     * @param miserykey {String} The value of `CUTCAPTCHA_MISERY_KEY` variable defined on page. Ironic.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {ProxiedCaptchaExtras?}
     * @returns 
     */
    public async cutCaptcha<T extends boolean>(
        siteurl: string, miserykey: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {}
    ) {
        const cid = await this.newTask({
            task: {
                type: proxied ? "CutCaptchaTask" : "CutCaptchaTaskProxyless",
                websiteURL: siteurl,
                miseryKey: miserykey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a DataDome captcha using a provided proxy.
     * This captcha has many several things to be aware of, check out https://2captcha.com/api-docs/datadome-slider-captcha for more information.
     * @param siteurl The full URL of the target page where the captcha is shown.
     * @param captchaurl The value of the src pramater for the iframe element containing the captcha.
     * @param extras {DataDomeExtras}
     * @returns {Promise<CaptchaResult<DataDomeCaptchaResult>>}
     */
    public async datadome(siteurl: string, captchaurl: string, extras: DataDomeExtras): Promise<CaptchaResult<DataDomeCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                type: "DataDomeTask",
                websiteURL: siteurl,
                captchaUrl: captchaurl,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a FriendlyCaptcha.
     * @param siteurl {String} The full URL of the target page where the captcha is shown.
     * @param sitekey {String} The value of `data-sitekey` attribute on a captcha's div element.
     * @param proxied {Boolean} If the captcha should be solved with a user provided proxy.
     * @param extras {ProxiedCaptchaExtras?}
     */
    public async friendlyCaptcha<T extends boolean>(
        siteurl: string, sitekey: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {} = {} as any
    ) {
        const cid = await this.newTask({
            task: {
                type: proxied ? "FriendlyCaptchaTask" : "FriendlyCaptchaTaskProxyless",
                websiteURL: siteurl,
                websiteKey: sitekey,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }
}