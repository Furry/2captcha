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

    public async pollResponse(id: string): Promise<string> {
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
                return data.request
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

    public async recaptcha(googlekey: string, pageurl: string, extra: UserRecaptchaExtra = { }): Promise<string> {
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
}