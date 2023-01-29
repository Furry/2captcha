import fetch from "../utils/fetch"

import { APIError } from "./2captchaError"
import * as utils from "../utils/generic"

interface BaseSolve {

}

export interface UserRecaptchaExtra extends BaseSolve {
    invisible?: boolean,
    "data-s"?: string,
    cookies?: string,
    userAgent?: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
    action?: string,
    enterprise?: 0 | 1,
    min_score?: number,
    version?: string
}

export interface UserHCaptchaExtra extends BaseSolve {
    header_acao?: boolean,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    invisible?: 0 | 1,
    data?: string,
    userAgent?: string,
    soft_id?: number;
}

export interface UserImageCaptchaExtra extends BaseSolve {
    phrase?: 0 | 1,
    regsense?: 0 | 1,
    numeric?: 0 | 1 | 2 | 3 | 4,
    calc?: 0 | 1,
    min_len?: 0 | string | number, // 1..20
    max_len?: 0 | string | number, // 1..20
    language?: 0 | 1 | 2,
    lang?: string,
}

// FixMe: parameter "offline" is boolean or number? 
// https://2captcha.com/2captcha-api#solving_geetest:~:text=on%20target%20website-,offline,-Number%0ADefault%3A%200
export interface UserGeetestExtra extends BaseSolve {
    api_server?: string,
    offline?: number | boolean,
    new_captcha?: number | boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
}

/**
 * An object containing properties of the captcha solution.
 * @typedef {Object} CaptchaAnswer
 * @param {string} data The solution to the captcha
 * @param {string} id The captcha ID
 */
interface CaptchaAnswer {
    /** The solution to the captcha */
    data: string,
    /** The ID of the captcha solve */
    id: string
}

/**
 * The main 2captcha class, housing all API calls and api interactions.
 */
export class Solver {
    public _apikey: string
    public _pollingFrequency: number
    public _headerACAO: number;

    /**
     * The constructor for the 2captcha Solver class.
     * 
     * @param apikey {string} The API key to use
     * @param pollingFrequency {number} The frequency to poll for requests
     */
    constructor(apikey: string, pollingFrequency: number = 5000, enableACAO: boolean = true) {
        this._apikey = apikey
        this._pollingFrequency = pollingFrequency
        this._headerACAO = enableACAO ? 1 : 0
    }

    /** The API key this instance is using */
    public get apikey() { return this._apikey }
    /** Frequency the instance polls for updates */
    public get pollingFrequency() { return this._pollingFrequency }
    /** Set the API key for this instance */
    public set apikey(update: string) { this._apikey = update }

    private get in() { return "https://2captcha.com/in.php" }
    private get res() { return "https://2captcha.com/res.php"}
    private get defaultPayload() { return { key: this.apikey, json: 1, header_acao: this._headerACAO, soft_id: 100500100 } }

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
    public async balance(): Promise<number> {
        const res = await fetch(this.res + utils.objectToURI({
            ...this.defaultPayload,
            action: "getbalance"
        }))
        const result = await res.text()

        try {
            const data = JSON.parse(result)
            if (data.status == 1) {
                return parseFloat(data.request)
            }
            throw new APIError(data.request)
        } catch {
            throw new APIError(result)
        }
    }

    /**
     * @private
     * 
     * Polls for  a captcha, finding out if it's been completed
     * @param {string} id Captcha ID
     * 
     * @returns {Promise<CaptchaAnswer>}
     * @throws APIError
     */
    private async pollResponse(id: string): Promise<CaptchaAnswer> {
        const payload = {
            ...this.defaultPayload,
            action: "get",
            id: id
        }

        await utils.sleep(this.pollingFrequency)

        const res = await fetch(this.res + utils.objectToURI(payload))
        const result = await res.text()

        let data;
        try {
            data = JSON.parse(result)
            if (data.status == 1) {
                return { data: data.request, id: id }
            }
        } catch {
            throw new APIError(result)
        }
        switch (data.request) {
            case "CAPCHA_NOT_READY": 
                // console.log('CAPCHA_NOT_READY')
                return this.pollResponse(id);
            default: {
                throw new APIError(data.request)
            }
        }
    }

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
    public async recaptcha(googlekey: string, pageurl: string, extra: UserRecaptchaExtra = { }): Promise<CaptchaAnswer> {
        //'extra' is user defined, and the default contents should be overridden by it.
        const payload = {
            invisible: false,
            ...extra,
            googlekey: googlekey,
            pageurl: pageurl,
            method: "userrecaptcha",
            ...this.defaultPayload
        }

        const response = await fetch(this.in + utils.objectToURI(payload))
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.status == 1) {
            return this.pollResponse(data.request)
        } else {
            throw new APIError(data.request)
        }
    }

    /**
     * Solves a hCaptcha, returning the result as a string.
     * 
     * @param {string} sitekey The hcaptcha site key
     * @param {string} pageurl The URL the captcha appears on
     * @param {object} extra Extra options
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * @example
     * solver.hcaptcha("a5f74b19-9e45-40e0-b45d-47ff91b7a6c2", "https://accounts.hcaptcha.com/demo)
     * .then((res) => {
     *   console.log(res)
     * })
     */
    public async hcaptcha(sitekey: string, pageurl: string, extra: UserHCaptchaExtra = { }): Promise<CaptchaAnswer> {
        //'extra' is user defined, and the default contents should be overridden by it.
        const payload = {
            invisible: false,
            ...extra,
            sitekey: sitekey,
            pageurl: pageurl,
            method: "hcaptcha",
            ...this.defaultPayload
        }

        const response = await fetch(this.in + utils.objectToURI(payload))
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.status == 1) {
            return this.pollResponse(data.request)
        } else {
            throw new APIError(data.request)
        }
    }

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
     * solver.geetest("f2ae6cadcf7886856696502e1d55e00c", "12345678abc90123d45678ef90123a456b", "https://2captcha.com/demo/geetest", "api.geetest.com")
     * .then(res => {
     *      console.log(res)
     *  })
     */
     public async geetest(gt: string, challenge: string, pageurl: string, extra: UserGeetestExtra = { }): Promise<CaptchaAnswer> {
        //'extra' is user defined, and the default contents should be overridden by it.
        const payload = {
            ...extra,
            method: "geetest",
            gt: gt,
            challenge: challenge,
            pageurl: pageurl,
            ...this.defaultPayload
        }

        const response = await fetch(this.in + utils.objectToURI(payload))
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.status == 1) {
            return this.pollResponse(data.request)
        } else {
            throw new APIError(data.request)
        }
    }

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
    public async imageCaptcha(base64image: string, extra: UserImageCaptchaExtra = { }): Promise<CaptchaAnswer> {
        const payload = {
            ...extra,
            ...this.defaultPayload,
            method: "base64"
        }

        const response = await fetch(this.in + utils.objectToURI(payload), { body: JSON.stringify({ "body": base64image }) , method: "post" })
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.status == 1) {
            return this.pollResponse(data.request)
        } else {
            throw new APIError(data.request)
        }
    }

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
    public async funCaptcha(publicKey: string, pageURL: string, serviceURL?: string, extra: UserImageCaptchaExtra = { }): Promise<CaptchaAnswer> {
        const payload = {
            ...extra,
            ...this.defaultPayload,
            method: "funcaptcha",
            publickey: publicKey,
            pageurl: pageURL,
            ...(serviceURL ? { surl: serviceURL } : { })
        }

        const response = await fetch(this.in + utils.objectToURI(payload))
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.status == 1) {
            return this.pollResponse(data.request)
        } else {
            throw new APIError(data.request)
        }
    }

    /**
     * Reports a captcha as correctly solved.
     * 
     * @param id The ID of the captcha
     * @throws APIError
     * @example
     * solver.goodReport("123456789")
     */
    public async goodReport(id: string): Promise<void> {
        const payload = {
            id: id,
            action: "reportgood",
            ...this.defaultPayload
        }

        const response = await fetch(this.res + utils.objectToURI(payload))
        const result = await response.text();

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.request == "OK_REPORT_RECORDED") {
            return
        } else {
            throw new APIError(data.request)
        }
    }

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
    public async report(id: string): Promise<void> {
        const payload = {
            id: id,
            action: "reportbad",
            ...this.defaultPayload
        }

        const response = await fetch(this.res + utils.objectToURI(payload))
        const result = await response.text()

        let data;
        try {
            data = JSON.parse(result)
        } catch {
            throw new APIError(result)
        }

        if (data.request == "OK_REPORT_RECORDED") {
            return
        } else {
            throw new APIError(data.request)
        }
    }
}
