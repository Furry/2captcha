import fetch from "node-fetch"

import { APIError } from "./2captchaError"
import * as utils from "../utils/generic"
import { EventEmitter } from "events"

interface BaseSolve {

}

interface UserRecaptchaExtra extends BaseSolve {
    invisible?: boolean,
    "data-s"?: string,
    cookies?: string,
    userAgent?: string,
    header_acao?: boolean,
    pingback?: string,
    soft_id?: number,
    proxy?: string,
    proxytype?: string
}

interface UserHCaptchaExtra extends BaseSolve {
    header_acao?: boolean,
    pingback?: string,
    proxy?: string,
    proxytype?: string
}

interface UserImageCaptchaExtra extends BaseSolve {
    phrase?: 0 | 1,
    regsense?: 0 | 1,
    numeric?: 0 | 1 | 2 | 3 | 4,
    calc?: 0 | 1,
    min_len?: 0 | string, // 1..20
    max_len?: 0 | string, // 1..20
    language?: 0 | 1 | 2,
    lang?: string,
}

/**
 * An object containing the data and ID of the captcha solution.
 */
interface CaptchaAnswer {
    /** The solution to the captcha */
    data: string,
    /** The ID of the captcha solve */
    id: string
}

export default class _2captcha extends EventEmitter {
    apikey: string
    pollingFrequency: number
    constructor(apikey: string, pollingFrequency: number = 5000) {
        super()
        this.apikey = apikey
        this.pollingFrequency = pollingFrequency
    }

    get in() { return "https://2captcha.com/in.php" }
    get res() { return "https://2captcha.com/res.php"}
    get defaultPayload() { return { key: this.apikey, json: 1 } }

    /**
     * Returns the remaining account balance
     * 
     * @throws APIError
     *
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
     * Polls for  a captcha, finding out if it's been completed
     * @param id Captcha ID
     * 
     * @throws APIError
     * 
     */
    public async pollResponse(id: string): Promise<CaptchaAnswer> {
        const payload = {
            ...this.defaultPayload,
            action: "get",
            id: id
        }

        await utils.sleep(this.pollingFrequency)

        const res = await fetch(this.res + utils.objectToURI(payload))
        const result = await res.text()

        try {
            const data = JSON.parse(result)
            if (data.status == 1) {
                return { data: data.request, id: id }
            }
            switch (data.request) {
                case "CAPCHA_NOT_READY": return this.pollResponse(id);
                default: {
                    throw new APIError(data.request)
                }
            }
        } catch {
            throw new APIError(result)
        }
    }

    /**
     * Solves a google Recaptcha, returning the result as a string.
     * 
     * @param googlekey The google captcha key
     * @param pageurl The URL the captcha appears on
     * @param extra Extra options
     * 
     * @throws APIError
     * 
     */
    public async recaptcha(googlekey: string, pageurl: string, extra: UserRecaptchaExtra = { }): Promise<CaptchaAnswer> {
        //'extra' is user defined, and the default contents should be overridden by it.
        const payload = {
            invisible: false,
            header_acao: false,
            soft_id: 7215953,
            ...extra,
            googlekey: googlekey,
            pageurl: pageurl,
            action: "get",
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
     * Solves a google Recaptcha, returning the result as a string.
     * 
     * @param sitekey The hcaptcha site key
     * @param pageurl The URL the captcha appears on
     * @param extra Extra options
     * 
     * @throws APIError
     * 
     */
    public async hcaptcha(sitekey: string, pageurl: string, extra: UserHCaptchaExtra = { }): Promise<CaptchaAnswer> {
        //'extra' is user defined, and the default contents should be overridden by it.
        const payload = {
            invisible: false,
            header_acao: false,
            soft_id: 7215953,
            ...extra,
            sitekey: sitekey,
            pageurl: pageurl,
            action: "get",
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
     * Solves a image-based captcha.
     * @param base64image Base64 image data for the captcha
     * @param extra Extra properties to pass to 2captcha
     * 
     * @throws APIError
     * 
     * @example
     * const res = await imageCaptcha(fs.readFileSync("./captcha.png", "base64"))
     */
    public async imageCaptcha(base64image: string, extra: UserImageCaptchaExtra = { }) /*: Promise<string> */ {
        const payload = {
            soft_id: 7215953,
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
     * Report an unsuccessful solve
     * 
     * @param id The id of the captcha
     * 
     * @throws APIError
     * 
     */
    public async report(id: string): Promise<void> {
        const payload = {
            id: id,
            action: "reportbad",
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

        if (data.request == "OK_REPORT_RECORDED") {
            return
        } else {
            throw new APIError(data.request)
        }
    }
}