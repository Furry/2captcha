import { toBase64, toQueryString } from "../utils/conversions.js";
import L from "../utils/locale.js";
import fetch from "../utils/platform.js";
import { NetError, SolverError } from "./error.js";
export class Solver {
    _token;
    _locale;
    _pending = {};
    _interval = null;
    _userAgent = "2captchaNode / 4.0.0 - Node-Fetch (https://github.com/furry/2captcha)";
    constructor(token, locale = "en") {
        this._token = token;
        this._locale = locale;
    }
    /////////////
    // GETTERS //
    ///////////// 
    get token() {
        return this._token;
    }
    get in() {
        return L[this._locale].domain + "/in.php";
    }
    get out() {
        return L[this._locale].domain + "/res.php";
    }
    get defaults() {
        return {
            key: this._token,
            json: 1
        };
    }
    /////////////////////
    // Utility Methods //
    /////////////////////
    async get(url, query) {
        const response = await fetch(url + toQueryString(query), {
            method: "GET",
            headers: {
                "User-Agent": this._userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).catch(err => {
            throw new NetError(err, this._locale);
        });
        const json = await response.json();
        if (json.status == "0") {
            throw new SolverError(json.request, this._locale);
        }
        else {
            return json;
        }
    }
    async post(url, query, body) {
        const response = await fetch(url + toQueryString(query), {
            method: "POST",
            headers: {
                "User-Agent": this._userAgent,
            },
            body: body
        }).catch(err => {
            throw new NetError(err, this._locale);
        });
        const json = await response.json();
        if (json.status == "0") {
            throw new SolverError(json.request, this._locale);
        }
        else {
            return json;
        }
    }
    /**
     * Gets a list of all pending captchas.
     * @returns A list of all pending captchas.
     */
    getPending() {
        const pendingCache = [];
        // A shallow clone isn't enough, so they need to be iterated manually.
        for (const pending of Object.keys(this._pending)) {
            const c = this._pending[pending];
            pendingCache.push({
                startTime: c.startTime,
                captchaId: c.captchaId,
                polls: c.polls,
            });
        }
        return pendingCache;
    }
    /**
     * Get the balance of the account.
     *
     * @returns {Promise<number>} The current balance.
     */
    async balance() {
        return await this.get(this.out, {
            ...this.defaults, action: "getbalance"
        }).then(res => res.request);
    }
    /**
     * Gets all registered Pingback Domains
     * @returns {Promise<PingbackDomain[]>} The domains
     */
    async getPingbackDomains() {
        return await this.get(this.out, {
            ...this.defaults, action: "get_pingback"
        }).then(res => res.request ? res.request : []);
    }
    /**
     * Registers a new pingback domain to the account.
     * @param domain The domain to add
     * @returns {Promise<boolean>} Whether the domain was added.
     */
    async addPingbackDomain(domain) {
        return await this.get(this.out, {
            ...this.defaults, action: "add_pingback", addr: domain
        }).then(res => res.request);
    }
    /**
     * Determines the current price of a solved captcha.
     * @param captchaId The captcha ID to find the fee of.
     * @returns {Promise<number>} The fee of the captcha type.
     */
    async priceOfCaptcha(captchaId) {
        return await this.get(this.out, {
            ...this.defaults, action: "get2", id: captchaId
        }).then(res => res.request);
    }
    /**
     * Resolves all possible promises for outstanding captchas.
     */
    async getSolutions() {
        const pendingIds = Object.keys(this._pending);
        if (pendingIds.length == 0) {
            // remove the interval.
            clearInterval(this._interval);
            return;
        }
        // Captcha solutions from this endpoint are returned as a string seperated by a vertical bar. 
        // Eg. "263s2v|CAPCHA_NOT_READY|365312" and so on.
        const solutions = await this.get(this.out, {
            ...this.defaults, action: "get", ids: pendingIds.join(",")
        }).then((res) => res.request);
        solutions.split("|").forEach((state, index) => {
            const id = pendingIds[index];
            const captcha = this._pending[id];
            switch (state) {
                case "CAPCHA_NOT_READY":
                    // Increment the polls for the captcha by one.
                    captcha.polls++;
                    break;
                case "ERROR_CAPTCHA_UNSOLVABLE":
                    captcha.reject(new SolverError(state, this._locale));
                    delete this._pending[id];
                    break;
                default:
                    captcha.resolve({
                        id: id,
                        // Parse the JSON if it's valid, otherwise return the string.
                        data: (() => {
                            try {
                                return JSON.parse(state);
                            }
                            catch (_) {
                                return state;
                            }
                        })()
                    });
                    delete this._pending[id];
                    break;
            }
            ;
        });
    }
    /**
     * Registers a new captcha promise to the array of pending captchas, returning the promise
     * object that will be automatically resolved or rejected by the getSolutions() function.
     * @param captchaId The captcha ID to get the solution of.
     * @returns The resulting captcha promise.
     */
    async registerPollEntry(captchaId) {
        const captchaPromiseObject = {
            startTime: Date.now(),
            captchaId: captchaId,
            polls: 0
        };
        captchaPromiseObject.promise = new Promise((resolve, reject) => {
            // @ts-ignore
            captchaPromiseObject.resolve = resolve;
            captchaPromiseObject.reject = reject;
        });
        // Add the captcha to the pending list.
        this._pending[captchaId] = captchaPromiseObject;
        if (this._interval == null) {
            this._interval = setInterval(() => {
                this.getSolutions();
            }, 1000);
        }
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
     * @returns Captcha result.
     */
    async imageCaptcha(image, extra = {}) {
        const data = toBase64(image);
        const c = await this.post(this.in, {
            ...extra,
            ...this.defaults,
            method: "base64"
        }, JSON.stringify({ body: data }));
        return this.registerPollEntry(c.request);
    }
    // An alias for ImageCaptcha
    async textCaptcha(image, extra = {}) {
        return this.imageCaptcha(image, extra);
    }
    /**
     * Solves a recaptchaV2 captcha.
     * @param googlekey The google key to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async recaptchaV2(googlekey, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            googlekey: googlekey,
            pageurl: pageurl
        });
        return this.registerPollEntry(c.request);
    }
    /**
     * Solves a hCaptcha captcha.
     * @param sitekey The sitekey to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async hcaptcha(sitekey, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "hcaptcha",
            pageurl: pageurl,
            sitekey: sitekey
        });
        return this.registerPollEntry(c.request);
    }
    /**
     * Solves a GeeTest captcha.
     * @param gt The gt key to solve.
     * @param challenge The challenge key to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async geetest(gt, challenge, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "geetest",
            gt: gt,
            challenge: challenge,
            pageurl: pageurl
        });
        return this.registerPollEntry(c.request);
    }
    /**
     * Solves a GeeTest captcha.
     * @param sitekey The sitekey to solve.
     * @param pageurl URL of the page the captcha appears on.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async geetestv4(sitekey, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            captcha_id: sitekey,
            pageurl: pageurl,
            method: "geetest_v4"
        });
        return this.registerPollEntry(c.request);
    }
    /**
     * Solves a funCaptcha captcha.
     * @param url The URL to solve.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async funCaptcha(publickey, pageurl, serviceurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "funcaptcha",
            publickey: publickey,
            pageurl: pageurl,
            // Spread the serviceurl if it exists into the object.
            ...(serviceurl ? { surl: serviceurl } : {})
        });
        return this.registerPollEntry(c.request);
    }
    /**
     * Solves a rotate captcha.
     * @param url The URL to solve.
     * @param extra Any extra parameters to send to the solver.
     * @returns Captcha result.
     */
    async rotateCaptcha(image, angle = 40, extra) {
        const data = toBase64(image);
        const c = await this.post(this.in, {
            ...extra,
            ...this.defaults,
            method: "rotatecaptcha",
            angle: angle,
        }, JSON.stringify({ body: data }));
        return this.registerPollEntry(c.request);
    }
    async keyCaptcha(sscUserId, sscSessionId, sscWebserverSign, sscWebserverSign2, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "keycaptcha",
            s_s_c_user_id: sscUserId,
            s_s_c_session_id: sscSessionId,
            s_s_c_web_server_sign: sscWebserverSign,
            s_s_c_web_server_sign2: sscWebserverSign2,
            pageurl: pageurl
        });
        return this.registerPollEntry(c.request);
    }
    async recaptchaV3(sitekey, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            version: "v3",
            sitekey: sitekey,
            pageurl: pageurl
        });
        return this.registerPollEntry(c.request);
    }
    async recaptchaEnterprise(sitekey, pageurl, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "userrecaptcha",
            version: "v3",
            enterprise: "1",
            sitekey: sitekey,
            pageurl: pageurl
        });
        return this.registerPollEntry(c.request);
    }
    async turnstile(sitekey, extra = {}) {
        const c = await this.get(this.in, {
            ...extra,
            ...this.defaults,
            method: "turnstile",
            sitekey: sitekey
        });
        return this.registerPollEntry(c.request);
    }
}
