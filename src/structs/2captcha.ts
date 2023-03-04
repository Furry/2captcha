import fetch from "../utils/fetch"
import { APIError } from "./2captchaError"
import * as utils from "../utils/generic"
import  getProviderData  from "./providers/providers"
import { softId } from "./constants/constants"
import checkJSCaptchaParams from "../utils/checkJSCaptchaParams"


const provider = getProviderData ()

interface BaseSolve {

}

export interface paramsRecaptcha extends BaseSolve {
    pageurl: string,
    googlekey: string,
    invisible?: boolean,
    datas?: string,
    domain?: string,
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


export interface paramsHCaptcha extends BaseSolve {
    sitekey: string,
    pageurl: string,
    header_acao?: boolean,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    invisible?: 0 | 1,
    data?: string,
    userAgent?: string,
    soft_id?: number,
    domain?: string
}

// FixMe:data[key] - how to send this parameter
export interface paramsFunCapthca extends BaseSolve {
  publickey: string,
  pageurl: string,
  surl?: string,
  header_acao?: boolean,
  pingback?: string,
  proxy?: string,
  proxytype?: string,
  userAgent?: string,
  soft_id?: number;
}

export interface paramsImageCaptcha {
    phrase?: 0 | 1,
    regsense?: 0 | 1,
    numeric?: 0 | 1 | 2 | 3 | 4,
    calc?: 0 | 1,
    min_len?: 0 | string | number, // 1..20
    max_len?: 0 | string | number, // 1..20
    language?: 0 | 1 | 2,
    lang?: string,
    pingback?: string,
    textinstructions?: string
}

export interface paramsGeetest {
    gt: string,
    challenge: string,
    pageurl: string,
    api_server?: string,
    offline?: number | boolean,
    new_captcha?: number | boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
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
 * @property {string} userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha.
 * 
 */
export interface yandexSmart {
    pageurl: string,
    sitekey: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string,
    userAgent?: string
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

export interface paramsLemin {
    pageurl: string,
    captcha_id: string,
    div_id: string,
    api_server?: string,
    pingback?: string,
    proxy?: string,
    proxytype?: string
}

export interface paramsAmazonWAF {
    pageurl: string,
    sitekey: string,
    iv: string
    context: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string,
}

export interface paramsTurnstile {
    pageurl: string,
    sitekey: string,
    action?: string,
    data?: string,
    header_acao?: boolean,
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
 * 
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
     * 
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
     * ### Solves a google reCAPTCHA V2 | V3. 
     * 
     * [Read more about other reCAPTCHA parameters](https://2captcha.com/2captcha-api#solving_recaptchav2_new).
     * 
     * @param {{pageurl, googlekey, cookies, proxy, proxytype, userAgent, invisible, datas, pingback, action, enterprise, min_score, version, domain}} params Object
     * @param {string} params.pageurl The URL the captcha appears on.
     * @param {string} params.googlekey Value of `k` or `data-sitekey` parameter you found on page.
     * @param {string} params.cookies Your cookies that will be passed to our worker who solve the captha.
     * @param {string} params.proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
     * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`. 
     * @param {string} params.userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha. 
     * @param {number} params.invisible `1` - means that reCAPTCHA is invisible. `0` - normal reCAPTCHA.  
     * @param {string} params.datas Value of `data-s` parameter you found on page. Curenttly applicable for Google Search and other Google services.
     * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. [More info here](https://2captcha.com/2captcha-api#pingback).
     * @param {string} params.action Value of `action` parameter you found on page.
     * @param {string} params.enterprise `1` - defines that you're sending reCAPTCHA Enterpise.
     * @param {number} params.min_score The score needed for resolution reCAPTCHA V3. Currently it's almost impossible to get token with score higher than `0.3`
     * @param {string} params.version `v2` — defines that you're sending a reCAPTCHA V2. `v3` — defines that you're sending a reCAPTCHA V3.
     * @param {string} params.domain Domain used to load the captcha: `google.com` or `recaptcha.net`
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.recaptcha({
     *   pageurl: 'https://2captcha.com/demo/recaptcha-v2',
     *   googlekey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u'
     * })
     * .then((res) => {
     *     console.log(res);
     * })
     * .catch((err) => {
     *     console.log(err);
     * })
     */
    public async recaptcha(params: paramsRecaptcha): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "userrecaptcha")
        const payload = {
            ...params,
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
     * [Read more about other hCaptcha parameters](https://2captcha.com/2captcha-api#solving_hcaptcha).
     * 
     * @param {{sitekey, pageurl, data, userAgent, invisible, pingback, proxy, proxytype, domain}} params Object
     * @param {string} params.sitekey The hcaptcha site key. Value of `k` or `data-sitekey` parameter you found on page.
     * @param {string} params.pageurl The URL the captcha appears on.
     * @param {string} params.data Custom `data` that is used in some implementations of hCaptcha, mostly with `invisible=1`. In most cases you see it as `rqdata` inside network requests. IMPORTANT: you MUST provide `userAgent` if you submit captcha with `data` paramater. The value should match the User-Agent you use when interacting with the target website.
     * @param {string} params.userAgent Your userAgent that will be passed to our worker and used to solve the captcha. Required for hCaptcha with `data` parameter.
     * @param {number} params.invisible Use `1` for invisible version of hcaptcha. Currently it is a very rare case.
     * @param {string} params.pingback URL for pingback (callback) response that will be sent when captcha is solved. URL should be registered on the server. More info [here](https://2captcha.com/2captcha-api#pingback).
     * @param {string} params.proxy Format: `login:password@123.123.123.123:3128` You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
     * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
     * @param {string} params.domain Domain used to load the captcha: `hcaptcha.com` or `js.hcaptcha.com`
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * @example
     * solver.hcaptcha({
     *   pageurl: "https://2captcha.com/demo/hcaptcha",
     *   sitekey: "b76cd927-d266-4cfb-a328-3b03ae07ded6"
     * .then((res) => {
     *     console.log(res);
     * })
     * .catch((err) => {
     *     console.log(err);
     * })
     */
    public async hcaptcha(params: paramsHCaptcha): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "hcaptcha")
        const payload = {
            ...params,
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
     * Solves a GeeTest Captcha. [Read more about parameters and solving for Geetest captcha](https://2captcha.com/2captcha-api#solving_geetest).
     * 
     * @param {{ gt, challenge, api_server, offline, new_captcha,
     *  pageurl, pingback, proxy, proxytype, userAgent }} params
     * @param {string} params.gt Value of gt parameter found on site
     * @param {string} params.challenge Value of challenge parameter found on site
     * @param {string} params.pageurl The URL the captcha appears on
     * @param {string} params.api_server The URL of the api_server (recommended)
     * @param {number} params.offline In rare cases `initGeetest` can be called with `offline` parameter on the target page. If the call uses offline: true, set the value to `1`.
     * @param {number} params.new_captcha In rare cases `initGeetest` can be called with `new_captcha` parameter. If the call uses `new_captcha: true`, set the value to `1`. Mostly used with offline parameter.
     * @param {string} params.pingback URL for `pingback` (callback) response that will be sent when captcha is solved. [More info here](https://2captcha.com/2captcha-api#pingback).
     * @param {string} params.proxy Format: `login:password@123.123.123.123:3128`. You can find more info about proxies [here](https://2captcha.com/2captcha-api#proxies).
     * @param {string} params.proxytype Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
     * @param {string} params.userAgent Your `userAgent` that will be passed to our worker and used to solve the captcha.
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * ;(async () => {
     *      
     *  // Warning: Attention, the `challenge` value is not static but dynamic.
     *  // You need to find the queries that makes the captcha on the page to API.
     *  // Then you need to make request to this API and get new `challenge`.
     *  
     *  // For page https://rucaptcha.com/demo/geetest, api address is https://rucaptcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}
     *  // Also note that when make request to API, the request uses the dynamic parameter `t`
     *  
     *  // You can read more about sending GeeTest here https://2captcha.com/2captcha-api#solving_geetest, or here https://2captcha.com/p/geetest
     *  // In this example I solve GeeTest from page https://2captcha.com/demo/geetest
     *  
     *  const t = new Date().getTime()
     *  // below i make a request to get a new `challenge`. 
     *  const response = await fetch(`https://2captcha.com/api/v1/captcha-demo/gee-test/init-params?t=${t}`)
     *  const data = await response.json()
     *
     *  const params = { 
     *      pageurl: 'https://rucaptcha.com/demo/geetest',
     *      gt: data.gt,
     *      challenge: data.challenge
     *  }
     *
     *  const res = await solver.geetest(params)
     *  try {
     *      console.log(res)
     *      } catch (error) {
     *      console.error(error);
     *      }
     *  })()
     */
     public async geetest(params: paramsGeetest): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "geetest")
        const payload = {
            ...params,
            method: "geetest",
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
     * @param {string} params.pageurl Full URL of the page where you see Geetest V4 captcha.
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
        checkJSCaptchaParams(params, "geetest_v4")
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
     * @param {{pageurl, sitekey, pingback, proxy, proxytype, userAgent}} params The method takes arguments as an object.
     * @param {string} params.pageurl Required parameter. URL of the page where the captcha is located.
     * @param {string} params.sitekey Required parameter. The `sitekey` value you found on the captcha page.
     * @param {string} params.pingback An optional param.
     * @param {string} params.proxy An optional param. Format: `login:password@123.123.123.123:3128`.
     * @param {string} params.proxytype An optional param. Type of your proxy: `HTTP`, `HTTPS`, `SOCKS4`, `SOCKS5`.
     * @param {string} params.userAgent An optional param. Your `userAgent` that will be passed to our worker and used to solve the captcha.
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve.
     * @throws APIError
     * @example
     * solver.yandexSmart({ 
     *   pageurl: "https://captcha-api.yandex.ru/demo",
     *   sitekey: "FEXfAbHQsToo97VidNVk3j4dC74nGW1DgdxjtNB9"
     * })
     * .then((res) => {
     *   console.log(res)
     * })
     * .catch((err) => {
     *   console.log(err);
     * })
     */
    public async yandexSmart(params: yandexSmart): Promise<CaptchaAnswer> {
    checkJSCaptchaParams(params, "yandex")
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
     * Solves a image-based captcha. [Read more about parameters for image captcha](https://2captcha.com/2captcha-api#solving_normal_captcha).
     * 
     * @param {string} base64image Base64 image data for the captcha
     * @param {{ phrase,
     *           regsense,
     *           numeric,
     *           calc,
     *           min_len,
     *           max_len,
     *           language,
     *           lang,
     *           textinstructions,
     *           pingback }} params Extra properties to pass to 2captcha.
     * @param {number} params.phrase Captcha contains two or more words? `1` - Yes. `0` - No.
     * @param {number} params.regsense Captcha is case sensitive? `1` - Yes. `0` - No.
     * @param {number} params.numeric `0` - not specified. `1` - captcha contains only numbers. `2` - captcha contains only letters. `3` - captcha contains only numbers OR only letters. `4` - captcha MUST contain both numbers AND letters.
     * @param {number} params.calc  Does captcha require calculations? (e.g. type the result 4 + 8 = ) `1` - Yes. `0` - No.
     * @param {number} params.min_len `1..20` - minimal number of symbols in captcha. `0` - not specified.
     * @param {number} params.max_len `1..20` - maximal number of symbols in captcha. `0` - not specified.
     * @param {number} params.language `0` - not specified. `1` - Cyrillic captcha. `2` - Latin captcha
     * @param {string} params.lang Language code. [See the list of supported languages](https://2captcha.com/2captcha-api#language).
     * @param {string} params.textinstructions Text will be shown to worker to help him to solve the captcha correctly. For example: type red symbols only.
     * @param {string} params.pingback URL for `pingback` (callback) response that will be sent when captcha is solved. [More info here](https://2captcha.com/2captcha-api#pingback).
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * @example
     * const imageBase64 = fs.readFileSync("./tests/media/imageCaptcha_6e584.png", "base64")
     * 
     * solver.imageCaptcha(imageBase64, { numeric: 4, min_len: 5, max_len: 5 })
     * .then((res) => {
     *     console.log(res);
     * })
     * .catch((err) => {
     *     console.log(err);
     * })
     */
    public async imageCaptcha(base64image: string, params: paramsImageCaptcha = { }): Promise<CaptchaAnswer> {
        const isTheFirstParameterHasAnIncorrectType = typeof(arguments[0]) !== 'string'
        if(isTheFirstParameterHasAnIncorrectType){
            throw new Error(`Error when check params image captcha. Field "base64image" is incorrect type. The "base64image" field must be a string containing an image in the "base64" format. Please correct the "base64image" field and try again.`)
        }

        const payload = {
            ...params,
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
     * ### Solves Arkose Labs FunCaptcha.
     * 
     * [Read more](https://2captcha.com/2captcha-api#solving_funcaptcha_new) about other solving and other parameters for Arkose Labs FunCaptcha.
     * 
     * @param {{pageurl, publicKey, surl}} params Object
     * @param {string} params.publicKey The FunCaptcha Public Key
     * @param {string} params.pageurl The URL to the website the captcha is seen on
     * @param {string} params.surl The FunCaptcha Service URL (recommended)
     * 
     * @returns {Promise<CaptchaAnswer>} The result from the solve
     * @throws APIError
     * 
     * @example
     *  solver.funCaptcha({
     *    pageurl: "https://funcaptcha.com/tile-game-lite-mode/fc/api/nojs/?pkey=804380F4-6844-FFA1-ED4E-5877CA1F1EA4&lang=en",
     *    publickey: "804380F4-6844-FFA1-ED4E-5877CA1F1EA4"
     *  })
     *  .then((res) => {
     *      console.log(res);
     *  })
     *  .catch((err) => {
     *      console.log(err);
     *  })
     */
    public async funCaptcha(params: paramsFunCapthca): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "funcaptcha")
        const payload = {
            ...params,
            method: "funcaptcha",
            ...this.defaultPayload,
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
     * 
     * ### Solves a Lemin captcha
     * 
     * [Read more about other Lemin captcha parameters](https://2captcha.com/2captcha-api#lemin).
     * 
     * @param {{ pageurl, captcha_id, div_id }} params Object
     * @param {string} params.pageurl The URL the captcha appears on.
     * @param {string} params.captcha_id Value of `captcha_id` parameter you found on page.
     * @param {string} params.div_id Value `id` of captcha pareent `<div></div>` element.
     * 
     * @example
     * solver.lemin({
     *   pageurl:'https://dashboard.leminnow.com/auth/login', 
     *   captcha_id: 'CROPPED_099216d_34698cb7b8574265925f493cbcb3df4d',
     *   div_id: 'lemin-cropped-captcha',
     *   api_server: 'https://api.leminnow.com/captcha/v1/cropped'
     * })
     * .then((res) => {
     *     console.log(res);
     * })
     * .catch((err) => {
     *     console.log(err);
     * })
     */
    public async lemin(params: paramsLemin): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "lemin")
        const payload = {
            ...params,
            method: "lemin",
            ...this.defaultPayload,
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
     * 
     * ### Solves Amazon WAF captcha
     * 
     * [Read more about "Amazon WAF" captcha](https://2captcha.com/2captcha-api#amazon-waf).
     * 
     * @param {{ pageurl, sitekey, iv, context }} params The `amazonWaf` method takes arguments as an object. Thus, the `pageurl`, `sitekey`, `iv`, `context` fields in the passed object are mandatory. [Open example](https://github.com/dzmitry-duboyski/2captcha-ts/blob/master/tests/amazonWaf.js)
     * @param {string} params.pageurl Is the full `URL` of page where you were challenged by the captcha.
     * @param {string} params.sitekey Is a value of `key` parameter in the page source.
     * @param {string} params.iv Is a value of `iv` parameter in the page source.
     * @param {string} params.context  Is a value of `context` parameter in the page source.
     * 
     * @example 
     * solver.amazonWaf({
     *  pageurl: "https://non-existent-example.execute-api.us-east-1.amazonaws.com/latest",
     *  sitekey: "AQIDAHjcYu/GjX+QlghicBgQ/7bFaQZ+m5FKCMDnO+vTbNg96AHMDLodoefdvyOnsHMRtEKQAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMUX+ZqwwuANRnZujSAgEQgDvHSxUQmVBuyUtumoW2n4ccTG7xQN1r3X/zz41qmQaYv9SSSvQrjIoDXKaUQ23tVb4ii8+uljuRdz/HPA==",
     *  context: "9BUgmlm48F92WUoqv97a49ZuEJJ50TCk9MVr3C7WMtQ0X6flVbufM4n8mjFLmbLVAPgaQ1Jydeaja94iAS49ljb+sUNLoukWedAQZKrlY4RdbOOzvcFqmD/ZepQFS9N5w15Exr4VwnVq+HIxTsDJwRviElWCdzKDebN/mk8/eX2n7qJi5G3Riq0tdQw9+C4diFZU5E97RSeahejOAAJTDqduqW6uLw9NsjJBkDRBlRjxjn5CaMMo5pYOxYbGrM8Un1JH5DMOLeXbq1xWbC17YSEoM1cRFfTgOoc+VpCe36Ai9Kc=",
     *  iv: "CgAHbCe2GgAAAAAj",
     * })
     * .then((res) => {
     *     console.log(res);
     * })
     * .catch((err) => {
     *     console.log(err);
     * })
     */
    public async amazonWaf(params: paramsAmazonWAF): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "amazon_waf")
        const payload = {
            ...params,
            method: "amazon_waf",
            ...this.defaultPayload,
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
     * 
     * ### Solves Cloudflare Turnstile captcha
     * 
     * [Read more about Cloudflare Turnstile captcha](https://2captcha.com/2captcha-api#turnstile).
     * 
     * @param {{ pageurl, sitekey, action, data }} params The `сloudflareTurnstile` method takes arguments as an object. Thus, the `pageurl`, `sitekey` fields in the passed object are mandatory. [Open example](https://github.com/dzmitry-duboyski/2captcha-ts/blob/master/tests/turnstile.js)
     * @param {string} params.pageurl 	Full `URL of the page where you see the captcha.
     * @param {string} params.sitekey Is a value of `sitekey` parameter in the page source.
     * @param {string} params.action Value of optional `action` parameter you found on page.
     * @param {string} params.data  Value of optional `data` parameter you found on page.
     * 
     * @example 
     * solver.cloudflareTurnstile({
     *   pageurl: "https://app.nodecraft.com/login",
     *   sitekey: "0x4AAAAAAAAkg0s3VIOD10y4"    
     * })
     * .then((res) => {
     *   console.log(res);
     * })
     * .catch((err) => {
     *   console.log(err);
     * })
     */
    public async cloudflareTurnstile(params: paramsTurnstile): Promise<CaptchaAnswer> {
        checkJSCaptchaParams(params, "turnstile")
        const payload = {
            ...params,
            method: "turnstile",
            ...this.defaultPayload,
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
