interface BaseSolve {
}
interface UserRecaptchaExtra extends BaseSolve {
    invisible?: boolean;
    "data-s"?: string;
    cookies?: string;
    userAgent?: string;
    header_acao?: boolean;
    pingback?: string;
    soft_id?: number;
    proxy?: string;
    proxytype?: string;
}
interface UserHCaptchaExtra extends BaseSolve {
    header_acao?: boolean;
    pingback?: string;
    proxy?: string;
    proxytype?: string;
}
interface UserImageCaptchaExtra extends BaseSolve {
    phrase?: 0 | 1;
    regsense?: 0 | 1;
    numeric?: 0 | 1 | 2 | 3 | 4;
    calc?: 0 | 1;
    min_len?: 0 | string;
    max_len?: 0 | string;
    language?: 0 | 1 | 2;
    lang?: string;
}
/**
 * An object containing properties of the captcha solution.
 * @typedef {Object} CaptchaAnswer
 * @param {string} data The solution to the captcha
 * @param {string} id The captcha ID
 */
interface CaptchaAnswer {
    /** The solution to the captcha */
    data: string;
    /** The ID of the captcha solve */
    id: string;
}
/**
 * The main 2captcha class, housing all API calls and api interactions.
 */
export declare class Solver {
    _apikey: string;
    _pollingFrequency: number;
    /**
     * The constructor for the 2captcha Solver class.
     *
     * @param apikey {string} The API key to use
     * @param pollingFrequency {number} The frequency to poll for requests
     */
    constructor(apikey: string, pollingFrequency?: number);
    /** The API key this instance is using */
    get apikey(): string;
    /** Frequency the instance polls for updates */
    get pollingFrequency(): number;
    /** Set the API key for this instance */
    set apikey(update: string);
    private get in();
    private get res();
    private get defaultPayload();
    /**
     * Returns the remaining account balance.
     *
     * @return {Promise<Number>} Remaining balance
     * @throws APIError
     * @example
     * Solver.balance()
     * .then((res) => {
     *   console.log(res)
     * })
     */
    balance(): Promise<number>;
    /**
     * @private
     *
     * Polls for  a captcha, finding out if it's been completed
     * @param {string} id Captcha ID
     * @param {number} pollingFreq Polling Frequency
     *
     * @returns {Promise<CaptchaAnswer>}
     * @throws APIError
     */
    private pollResponse;
    /**
     * Solves a google Recaptcha, returning the result as a string.
     *
     * @param {string} googlekey The google captcha key
     * @param {string} pageurl The URL the captcha appears on
     * @param {object} extra Extra options
     *
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.recaptcha("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")
     * .then((res) => {
     *   console.log(res)
     * })
     */
    recaptcha(googlekey: string, pageurl: string, extra?: UserRecaptchaExtra): Promise<CaptchaAnswer>;
    /**
     * Solves a google Recaptcha, returning the result as a string.
     *
     * @param {string} sitekey The hcaptcha site key
     * @param {string} pageurl The URL the captcha appears on
     * @param {object} extra Extra options
     *
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * @example
     * solver.recaptcha("37f92ac1-4956-457e-83cd-723423af613f", "https://www.tokyobitcoiner.com/hcaptcha")
     * .then((res) => {
     *   console.log(res)
     * })
     */
    hcaptcha(sitekey: string, pageurl: string, extra?: UserHCaptchaExtra): Promise<CaptchaAnswer>;
    /**
     * Solves a image-based captcha.
     * @param {string} base64image Base64 image data for the captcha
     * @param {object} extra Extra properties to pass to 2captcha
     *
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * @example
     * imageCaptcha(fs.readFileSync("./captcha.png", "base64"))
     * .then((res) => {
     *   console.log(res)
     * })
     */
    imageCaptcha(base64image: string, extra?: UserImageCaptchaExtra): Promise<CaptchaAnswer>;
    /**
     * Solves a FunCaptcha
     * @param publicKey The FunCaptcha Public Key
     * @param pageurl The URL to the website the captcha is seen on
     * @param serviceURL The FunCaptcha Service URL (recommended)
     * @param extra Extra properties to pass to 2captcha
     *
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * funCaptcha("12AB34CD-56F7-AB8C-9D01-2EF3456789A0", "http://mysite.com/page/with/funcaptcha/")
     * .then((res) => {
     *   console.log(res)
     * })
     */
    funCaptcha(publicKey: string, pageURL: string, serviceURL?: string, extra?: UserImageCaptchaExtra): Promise<CaptchaAnswer>;
    /**
     * Solves a geetest Captcha, returning the result as a string.
     *
     * @param {string} gt Value of gt parameter found on site
     * @param {string} challenge Value of challenge parameter found on site
     * @param {string} pageurl The URL the captcha appears on
     * @param {string} api_server The URL of the api_server (recommended)
     * @param {object} extra Extra options
     *
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.geetest("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/")
     * .then((res) => {
     *   console.log(res)
     * })
     */
    geetest(gt: string, challenge: string, pageurl: string, api_server?: string, extra?: UserRecaptchaExtra): Promise<CaptchaAnswer>;
    /**
     * Report an unsuccessful solve
     *
     * @param {string} id The id of the captcha solve
     *
     * @returns {Promise<void>} Resolves on completion
     * @throws APIError
     * @example
     * report("55316")
     */
    report(id: string): Promise<void>;
}
export {};
//# sourceMappingURL=2captcha.d.ts.map