import {
    AmazonCaptchaResult,
    AmazonTaskExtras,
    Base64String, BoundingBoxResult, CaptchaResult,
    CapyTaskExtras,
    CapyTaskResult,
    CloudflareTurnstile,
    CoordinateCaptchaResult,
    CoordinatesTaskExtras,
    DataDomeCaptchaResult,
    DataDomeExtras,
    DrawAroundResult,
    GCImageInstruction,
    GCTextInstruction,
    GeetestExtrasV3,
    GeetestExtrasV4,
    GeetestResult,
    GenericObject, GridCaptchaResult, HCaptchaExtras, HCaptchaResult, ImageCaptchaExtras,
    KeyCaptcha,
    LanguagePool,
    LeminCaptchaResult,
    LeminTaskExtras,
    PendingCaptcha,
    PendingCaptchaStorage,
    PollError,
    PollResult,
    ProxiedCaptchaExtras,
    RecaptchaV2Extras,
    RecaptchaResult,
    RecaptchaV3Extras,
    RotateCaptchaExtras,
    RotateCaptchaResult,
    SingleTokenResult,
    Task,
    TurnstileDefault,
    TurnstileResult,
    GeetestV4Result,
} from "../types.js";

import { toBase64, toQueryString } from "../utils/conversions.js";
import locale from "../utils/locale.js";
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
        return "https://api.2captcha.com/"
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
    private async poll(captcha: PendingCaptchaStorage) {
        try {
            const response = await fetch(this.api + "/getTaskResult", {
                method: "POST",
                headers: {
                    "User-Agent": this._userAgent,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientKey: this._token,
                    taskId: captcha.captchaId
                })
            }).then(res => res.json() as Promise<PollResult | PollError>);

            if (response.errorId != 0) {
                return captcha.reject(new SolverError(response.errorCode, response.errorId, response.errorCode, this._locale))
            }

            switch (response.status) {
                case "ready":
                    return captcha.resolve(response as unknown as CaptchaResult<any>)
                    break;
                case "processing":
                    captcha.polls++;
                default:
                    captcha["interval"] = setTimeout(() => {
                        this.poll(captcha);
                    }, 5000)
            }
        } catch (err) { // Likely server or API error if no code was received.
            captcha["interval"] = setTimeout(() => {
                this.poll(captcha);
            }, 10000)
        }
    }

    private async get(endpoint: string) {
        return await fetch(this.api, {
            method: "GET",
            headers: {
                "User-Agent": this._userAgent,
                "Content-Type": "application/json"
            }, 
        }).catch(err => {
            throw new NetError(err, this._locale);
        });

    }

    /**
     * Registers a new task to the 2captcha API, queuing it for automatic polling.
     * @param body The v2 task to send to 2captcha. (https://2captcha.com/api-docs/text)
     */
    protected async newTask(body: Task) {
        (body as any)["soft_id"] = 3316;

        const response = await fetch(this.api + "/createTask", {
            method: "POST",
            headers: {
                "User-Agent": this._userAgent,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientKey: this._token,
                ...body,
                soft_id: 3316
            })
        }).catch(err => {
            throw new NetError(err, this._locale);
        })

        let json;
        try {
            json = await response.json();
        } catch (e) {
            let t = await response.text()
            throw new NetError("UnexpectedHTMLResponse", this._locale);
        }

        if (json.errorId == 0) {
            return json.taskId;
        } else {
            throw new SolverError(json.errorDescription, json.id, json.errorCode, this._locale);
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
        return await this.get("/getBalance")
            .then(res => res.json())
            .then(res => res.balance);
    }

    /**
     * Registers a new captcha promise to the array of pending captchas, returning the promise
     * object that will be automatically resolved or rejected by the getSolutions() function.
     * @param captchaId The captcha ID to get the solution of.
     * @returns The resulting captcha promise.
     */
    protected async registerPollEntry<T>(task: number, delay = 5000): Promise<CaptchaResult<T>> {
        const captchaPromiseObject: PendingCaptchaStorage = {
            startTime: Date.now(),
            captchaId: task,
            polls: 0
        } as any;

        captchaPromiseObject.promise = new Promise<CaptchaResult<T>>((resolve, reject) => {
            // @ts-ignore
            captchaPromiseObject.resolve = resolve;
            captchaPromiseObject.reject = reject;
        });

        // Add the captcha to the pending list.
        this._pending[task] = captchaPromiseObject;

        captchaPromiseObject["interval"] = setTimeout(() => {
            this.poll(captchaPromiseObject)
        }, delay) as unknown as number;
     
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
     * @returns {Promise<CaptchaResult<{text: string}>>}
     * @throws {SolverError}
     */
    public async imageCaptcha(image: Base64String | Buffer, extras: ImageCaptchaExtras = {}): Promise<CaptchaResult<{text: string}>> {
        const cid = await this.newTask({
            task: {
                type: "ImageToTextTask",
                body: toBase64(image),
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a text based captcha
     * @param comment {String} The comment to solve.
     * @param language {LanguagePool} The locale to solve the captcha in.
     * @returns {CaptchaResult<DefaultCaptcha>}
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<{text: string}>>}
     * @example
     * <Solver>.textCaptcha("What is the color of the sky?", "en").then((res) => {
     *   console.log(res.data);
     * })
     */
    public async textCaptcha(comment: string, language: LanguagePool = "en"): Promise<CaptchaResult<{text: string}>> {
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
     * Solves a rotate captcha where you are required to rotate an image to align it.
     * @param image The image to rotate.
     * @param extras {RotateCaptchaExtras?}
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<RotateCaptchaResult>>}
     */
    public async rotateCaptcha(image: Base64String | Buffer, extras: RotateCaptchaExtras = {}): Promise<CaptchaResult<RotateCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                type: "RotateTask",
                body: toBase64(image),
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solve a captcha where you have to click on points inside an image.
     * @param image
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<CoordinateCaptchaResult>>}
     */
    public async CoordinatesCaptcha(image: Base64String | Buffer, extras: CoordinatesTaskExtras = {}): Promise<CaptchaResult<CoordinateCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                type: "CoordinatesTask",
                body: toBase64(image),
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a grid captcha where you have to click on a grid of images.
     * Either a 'imgInstructions' image or a 'comment' in the extras field is required, and inforced by typings.
     * @param image The image to solve for.
     * @param extras {GCImageInstruction | GCTextInstruction} Extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<GridCaptchaResult>>}
     */
    public async gridCaptcha(image: Base64String | Buffer, extras: GCImageInstruction | GCTextInstruction): Promise<CaptchaResult<GridCaptchaResult>> {
        const cid = await this.newTask({
            task: {
                type: "GridTask",
                body: toBase64(image),
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a captcha where you need to draw around an object in an image.
     * Either a 'imgInstructions' image or a 'comment' in the extras field is required, and inforced by typings.
     * @param image The image to solve for.
     * @param extras {GCImageInstruction | GCTextInstruction} Extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<DrawAroundResult>>}
     */
    public async drawAround(image: Base64String | Buffer, extras: GCImageInstruction | GCTextInstruction): Promise<CaptchaResult<DrawAroundResult>> {
        const cid = await this.newTask({
            task: {
                type: "DrawAroundTask",
                body: toBase64(image),
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a captcha where you need to draw form a box around an object in an image.
     * Either a 'imgInstructions' image or a 'comment' in the extras field is required, and inforced by typings.
     * @param image The image to solve for.
     * @param extras {GCImageInstruction | GCTextInstruction} Extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<BoundingBoxResult>>}
     */
    public async boundingBox(image: Base64String | Buffer, extras: GCImageInstruction | GCTextInstruction): Promise<CaptchaResult<BoundingBoxResult>> {
        const cid = await this.newTask({
            task: {
                type: "BoundingBoxTask",
                body: image,
                ...extras
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Convert recorded audio to text.
     * Max of 1MB file size, MP3 format only.
     * @param image The image to solve for.
     * @param extras {GCImageInstruction | GCTextInstruction} Extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<{token: string}>>}
     * 
     */
    public async audioTask(
        audio: Base64String | Buffer,
        lang: "en" | "fr" | "de" | "el" | "pt" | "ru" = "en"
    ): Promise<CaptchaResult<{token: string}>> {
        const cid = await this.newTask({
            task: {
                type: "AudioTask",
                body: toBase64(audio),
                language: lang
            }
        })

        return this.registerPollEntry(cid);
    }

    /**
     * Solves a recaptchaV2 captcha.
     * @param sitekey {String} The google key to solve.
     * @param pageurl {String} URL of the page the captcha appears on.
     * @param proxied {Boolean} Whether to use a proxy to solve the captcha.
     * @param extra {RecaptchaV2Extras | ProxiedCaptchaExtras?} Any extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<RecaptchaResult>>}
     */
    public async recaptchaV2<T extends boolean>(
        sitekey: string, pageurl: string, 
        proxied: T = false as T,
        enterprise: boolean = false,
        extras: T extends false ? RecaptchaV2Extras : RecaptchaV2Extras | ProxiedCaptchaExtras)
        : Promise<CaptchaResult<RecaptchaResult>> {

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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<RecaptchaResult>>}
     */
    public async recaptchaV3(sitekey: string, pageurl: string, extras: RecaptchaV3Extras): Promise<CaptchaResult<RecaptchaResult>> {
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<HCaptchaResult>>}
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
     * Solves a GeeTest v4 captcha
     * @param pageurl The URL of the page the captcha appears on.
     * @param proxied Whether to use a user provied proxy to solve this captcha.
     * @param extra Any extra parameters to send to the solver.
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<GeetestV4Result>>}
     */
    public async geetestV4<T extends boolean>(
        pageurl: string, proxied: T = false as T,
        extra: T extends false ? GeetestExtrasV4 : GeetestExtrasV4 | ProxiedCaptchaExtras
    ): Promise<CaptchaResult<GeetestV4Result>> {
        const cid = await this.newTask({
            task: {
                type: proxied ? "GeeTestTask" : "GeeTestTaskProxyless",
                websiteURL: pageurl,
                version: 4,
                ...extra
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<GeetestResult>>}
     */
    public async geetest<T extends boolean>(
        pageurl: string, gt: string, challenge: string, 
        proxied: T = false as T,
        extra: T extends false ?  GeetestExtrasV3 : GeetestExtrasV3 | ProxiedCaptchaExtras): Promise<CaptchaResult<GeetestResult>> {
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<TurnstileResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<TurnstileResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<CapyTaskResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<KeyCaptcha>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<LeminCaptchaResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<AmazonCaptchaResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<SingleTokenResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<SingleTokenResult>>}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<SingleTokenResult>>}
     */
    public async cutCaptcha<T extends boolean>(
        siteurl: string, miserykey: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {}
    ): Promise<CaptchaResult<SingleTokenResult>> {
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
     * @throws {SolverError}
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
     * @throws {SolverError}
     * @returns {Promise<CaptchaResult<SingleTokenResult>>}
     */
    public async friendlyCaptcha<T extends boolean>(
        siteurl: string, sitekey: string,
        proxied: T = false as T,
        extras: T extends true ? ProxiedCaptchaExtras : {} = {} as any
    ): Promise<CaptchaResult<SingleTokenResult>> {
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