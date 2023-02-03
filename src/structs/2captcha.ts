import fetch from "../utils/fetch"

import { APIError } from "./2captchaError"
import * as utils from "../utils/generic"
import  getProviderData  from "./providers/providers"
import { softId } from "./constants/constants"


const provider = getProviderData ()

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
 * Interface for yandexSmart captcha
 * 
 * @typedef {object} yandexSmart
 * @property {string} pageurl URL of the page where the captcha is located
 * @property {string} sitekey The `sitekey` value you found on the captcha page
 * @property {string} pingback
 * @property {string} proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
 * @property {string} proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
 * 
 */
export interface yandexSmart {
    pageurl: string,
    sitekey: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
}

/**
 * Interface for GeeTest V4 captcha
 * 
 * @typedef {object} paramsGeeTestV4
 * @property {string} pageurl Required parameter. URL of the page where the captcha is located
 * @property {string} captcha_id Required parameter. Value of `captcha_id` parameter you found on target website.
 * @property {string} pingback An optional param. [More info here](https://2captcha.com/2captcha-api#pingback).
 * @property {string} proxy An optional param. Format: `login:password@123.123.123.123:3128`
 * @property {string} proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
 * @property {string} userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
 * 
 */
export interface paramsGeeTestV4 {
    pageurl: string,
    captcha_id: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
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

    private get in() { return provider.in }
    private get res() { return provider.res}
    private get defaultPayload() { return { key: this.apikey, json: 1, header_acao: this._headerACAO, soft_id: softId } }

    /**
     * Returns the remaining account balance.
     * 
     * @return {Promise<Number>} Remaining balance
     * @throws APIError
     * @example
     * solver.balance()
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
     * Solves a google reCAPTCHA, returning the result as a string.
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
     * Solves a GeeTest Captcha, returning the result as a string.
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
     * ### Solves a GeeTest V4 Captcha.
     * 
     * 
     * This method accepts an object with the following fields: `pageurl`, `captcha_id`, `pingback`, `proxy`, `proxytype`, `userAgent`.
     * The `pageurl` and `captcha_id` fields are required.
     * 
     * @param {{pageurl, captcha_id, pingback, proxy, proxytype, userAgent}} params The method geetestV4 takes arguments as an object.
     * @param {string} params.captcha_id Required parameter. Value of `captcha_id` parameter you found on target website.
     * @param {string} params.pingback An optional param. [More info here](https://2captcha.com/2captcha-api#pingback).
     * @param {string} params.proxy An optional param. Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
     * @param {string} params.proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
     * @param {string} params.userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.geetestV4({    
     *    pageurl: 'https://2captcha.com/demo/geetest-v4',
     *    captcha_id: 'e392e1d7fd421dc63325744d5a2b9c73'
     * })
     * .then((res) => {
     *   console.log(res)
     * })
     * .catch((err) => {
     *   console.log(err);
     * })
     */
      public async geetestV4(params: paramsGeeTestV4): Promise<CaptchaAnswer> {
        const payload = {
            ...params,
            method: "geetest_v4",
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
     * Method for sending Yandex Smart Captcha.
     * This method accepts an object with the following fields: `pageurl`, `sitekey`, `pingback`, `proxy`, `proxytype`.
     * The `pageurl` and `sitekey` fields are required.
     * 
     * @param {{pageurl, sitekey, pingback, proxy, proxytype}} params The method takes arguments as an object.
     * @param {string} params.pageurl Required parameter. URL of the page where the captcha is located.
     * @param {string} params.sitekey Required parameter. The `sitekey` value you found on the captcha page.
     * @param {string} params.pingback An optional param.
     * @param {string} params.proxy An optional param. Format: `login:password@123.123.123.123:3128`.
     * @param {string} params.proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.yandexSmart({ pageurl: "https://captcha-api.yandex.ru/demo", sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9" })
     * .then((res) => {
     *   console.log(res)
     * })
     * .catch((err) => {
     *   console.log(err);
     * })
     */
    public async yandexSmart(params: yandexSmart): Promise<CaptchaAnswer> {
    const payload = {
        ...params,
        method: "yandex",
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
     * @param {string} id The ID of the captcha
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
     * solver.badReport("55316")
     */
    public async badReport(id: string): Promise<void> {
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
