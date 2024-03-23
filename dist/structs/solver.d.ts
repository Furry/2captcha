/// <reference types="node" />
import { Base64String, CaptchaResult, FunCaptchaExtras, GeetestExtras, GeetestV4Result, HCaptchaExtras, HCaptchaResult, ImageCaptchaExtras, KeyCaptchaExtras, PendingCaptcha, RecaptchaV2Extras, RecaptchaV3Extras, RotateCaptchaExtras, TurnstileExtras } from "../types.js";
import { Locale } from "../utils/locale.js";
export declare class Solver {
    private _token;
    private _locale;
    private _pending;
    private _interval;
    private _userAgent;
    constructor(token: string, locale?: Locale);
    get token(): string;
    private get in();
    private get out();
    private get defaults();
    private get;
    private post;
    /**
     * Gets a list of all pending captchas.
     * @returns A list of all pending captchas.
     */
    getPending(): PendingCaptcha[];
    /**
     * Get the balance of the account.
     *
     * @returns {Promise<number>} The current balance.
     */
    balance(): Promise<number>;
    /**
     * Gets all registered Pingback Domains
     * @returns {Promise<PingbackDomain[]>} The domains
     */
    getPingbackDomains(): Promise<string[]>;
    /**
     * Registers a new pingback domain to the account.
     * @param domain The domain to add
     * @returns {Promise<boolean>} Whether the domain was added.
     */
    addPingbackDomain(domain: string): Promise<boolean>;
    /**
     * Determines the current price of a solved captcha.
     * @param captchaId The captcha ID to find the fee of.
     * @returns {Promise<number>} The fee of the captcha type.
     */
    priceOfCaptcha(captchaId: string): Promise<number>;
    /**
     * Resolves all possible promises for outstanding captchas.
     */
    private getSolutions;
    /**
     * Registers a new captcha promise to the array of pending captchas, returning the promise
     * object that will be automatically resolved or rejected by the getSolutions() function.
     * @param captchaId The captcha ID to get the solution of.
     * @returns The resulting captcha promise.
     */
    private registerPollEntry;
    /**
     * Solves an image based captcha
     * @param image The image to solve.
     * @param extra  The extra data to send to the solver.
     * @returns Captcha result.
     */
    imageCaptcha(image: Base64String | Buffer, extra?: ImageCaptchaExtras): Promise<CaptchaResult<String>>;
    textCaptcha(image: Base64String | Buffer, extra?: ImageCaptchaExtras): Promise<CaptchaResult<String>>;
    /**
     * Solves a recaptchaV2 captcha.
     * @param googlekey The google key to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    recaptchaV2(googlekey: string, pageurl: string, extra?: RecaptchaV2Extras): Promise<CaptchaResult<String>>;
    /**
     * Solves a hCaptcha captcha.
     * @param sitekey The sitekey to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    hcaptcha(sitekey: string, pageurl: string, extra?: HCaptchaExtras): Promise<CaptchaResult<HCaptchaResult>>;
    /**
     * Solves a GeeTest captcha.
     * @param gt The gt key to solve.
     * @param challenge The challenge key to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    geetest(gt: string, challenge: string, pageurl: string, extra?: GeetestExtras): Promise<CaptchaResult<any>>;
    /**
     * Solves a GeeTest captcha.
     * @param sitekey The sitekey to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    geetestv4(sitekey: string, pageurl: string, extra?: GeetestExtras): Promise<CaptchaResult<GeetestV4Result>>;
    /**
     * Solves a funCaptcha captcha.
     * @param url The URL to solve.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    funCaptcha(publickey: string, pageurl: string, serviceurl?: string, extra?: FunCaptchaExtras): Promise<CaptchaResult<unknown>>;
    /**
     * Solves a rotate captcha.
     * @param url The URL to solve.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    rotateCaptcha(image: Base64String | Buffer, angle: number | undefined, extra: RotateCaptchaExtras): Promise<CaptchaResult<any>>;
    keyCaptcha(sscUserId: string, sscSessionId: string, sscWebserverSign: string, sscWebserverSign2: string, pageurl: string, extra?: KeyCaptchaExtras): Promise<CaptchaResult<any>>;
    recaptchaV3(sitekey: string, pageurl: string, extra?: RecaptchaV3Extras): Promise<CaptchaResult<any>>;
    recaptchaEnterprise(sitekey: string, pageurl: string, extra?: RecaptchaV3Extras): Promise<CaptchaResult<any>>;
    turnstile(sitekey: string, extra?: TurnstileExtras): Promise<CaptchaResult<any>>;
}
//# sourceMappingURL=solver.d.ts.map