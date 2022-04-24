/// <reference types="node" resolution-mode="require"/>
import { Base64String, CaptchaResult, FunCaptchaExtras, GeetestExtras, HCaptchaExtras, ImageCaptchaExtras, KeyCaptchaExtras, RecaptchaV2Extras, RecaptchaV3Extras, RotateCaptchaExtras } from "../types.js";
import { Locale } from "../utils/locale.js";
export declare class Solver {
    private _token;
    private _locale;
    private _pending;
    private _interval;
    constructor(token: string, locale?: Locale);
    get token(): string;
    private get in();
    private get out();
    private get defaults();
    private get;
    private post;
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
    imageCaptcha(image: Base64String | Buffer, extra?: ImageCaptchaExtras): Promise<CaptchaResult>;
    textCaptcha(image: Base64String | Buffer, extra?: ImageCaptchaExtras): Promise<CaptchaResult>;
    recaptchaV2(googlekey: string, pageurl: string, extra?: RecaptchaV2Extras): Promise<CaptchaResult>;
    hcaptcha(sitekey: string, pageurl: string, extra?: HCaptchaExtras): Promise<CaptchaResult>;
    geetest(gt: string, challenge: string, pageurl: string, extra?: GeetestExtras): Promise<CaptchaResult>;
    funCaptcha(publickey: string, pageurl: string, serviceurl?: string, extra?: FunCaptchaExtras): Promise<CaptchaResult>;
    rotateCaptcha(image: Base64String | Buffer, angle: number | undefined, extra: RotateCaptchaExtras): Promise<CaptchaResult>;
    keyCaptcha(sscUserId: string, sscSessionId: string, sscWebserverSign: string, sscWebserverSign2: string, pageurl: string, extra?: KeyCaptchaExtras): Promise<CaptchaResult>;
    recaptchaV3(sitekey: string, pageurl: string, extra?: RecaptchaV3Extras): Promise<CaptchaResult>;
    recaptchaEnterprise(sitekey: string, pageurl: string, extra?: RecaptchaV3Extras): Promise<CaptchaResult>;
}
//# sourceMappingURL=solver.d.ts.map