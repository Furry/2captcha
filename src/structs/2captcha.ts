import fetch from "node-fetch"

import { appendQuery } from "../utils/formatting"
import { sleep } from "../utils/generic"

interface RecaptchaOptions {
    url: string,
    captchaKey: string
}

/**
 * The main class for all 2captcha related calls.
 */
export class _2captcha {
    /**
     * The constructor for the 2captcha class
     * @param apikey Your 2captcha api key
     * @param 
     */
    constructor(private apikey: string, private recaptchaOptions?: RecaptchaOptions) {
        //
    }

    get in() { return "https://2captcha.com/in.php" }
    get res() { return "https://2captcha.com/res.php" }
    get default(): {[key: string]: string | number} {
        return {
            "key": this.apikey,
            "json": 1
        }
    }

    async poll(captchaId: string) {
        let result;
        while (true) {
            await sleep(10000)
            const url = appendQuery(this.res, {
                ...this.default,
                action: "get",
                id: captchaId
            })

            result = await fetch(url).then((res) => res.json())

            console.log(url)

            if (result.status == 1) {
                return result.request
            } else if (result.status != 1 && result.request != "CAPCHA_NOT_READY") {
                console.log("Throwing")
                throw result.request
            }
        }
    }

    private async newRecaptcha(site: string, captchakey: string) {
        const url = appendQuery(this.in, {
            ...this.default,
            method: "userrecaptcha",
            googlekey: captchakey,
            pageurl: site
        })

        const response = await fetch(url)
            .then((res) => res.json())
        //B

        if (response.status != 1) {
            throw response.request + ": " + response.error_text
        }

        return response.request
    }

    async solveRecaptcha(site?: string, captchaKey?: string) {
        if (!this.recaptchaOptions && !captchaKey) {
            throw "You must specify 'site' & 'captchaKey' if the constructor isn't initilized with 'recaptchaOptions'"
        }

        const captchaId = await this.newRecaptcha(
            site ? site : this.recaptchaOptions?.url as string,
            captchaKey ? captchaKey : this.recaptchaOptions?.captchaKey as string)
        //B

        return await this.poll(captchaId)
    }

}