var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { toBase64, toQueryString } from "../utils/conversions.js";
import L from "../utils/locale.js";
import fetch from "../utils/platform.js";
import { SolverError } from "./error.js";
export class Solver {
    constructor(token, locale = "en") {
        // No clue how to apply typings to this...
        this._pending = {};
        this._interval = null;
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
    get(url, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url + toQueryString(query), {
                method: "GET",
                headers: {
                    "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            const json = yield response.json();
            if (json.status == "0") {
                throw new SolverError(json.request, this._locale);
            }
            else {
                return json;
            }
        });
    }
    post(url, query, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url + toQueryString(query), {
                method: "POST",
                headers: {
                    "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
                },
                body: body
            });
            const json = yield response.json();
            if (json.status == "0") {
                throw new SolverError(json.request, this._locale);
            }
            else {
                return json;
            }
        });
    }
    /**
     * Get the balance of the account.
     *
     * @returns {Promise<number>} The current balance.
     */
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "getbalance" })).then(res => res.request);
        });
    }
    /**
     * Gets all registered Pingback Domains
     * @returns {Promise<PingbackDomain[]>} The domains
     */
    getPingbackDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "get_pingback" })).then(res => res.request ? res.request : []);
        });
    }
    /**
     * Registers a new pingback domain to the account.
     * @param domain The domain to add
     * @returns {Promise<boolean>} Whether the domain was added.
     */
    addPingbackDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "add_pingback", addr: domain })).then(res => res.request);
        });
    }
    /**
     * Determines the current price of a solved captcha.
     * @param captchaId The captcha ID to find the fee of.
     * @returns {Promise<number>} The fee of the captcha type.
     */
    priceOfCaptcha(captchaId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "get2", id: captchaId })).then(res => res.request);
        });
    }
    /**
     * Resolves all possible promises for outstanding captchas.
     */
    getSolutions() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingIds = Object.keys(this._pending);
            if (pendingIds.length == 0) {
                // remove the interval.
                clearInterval(this._interval);
                return;
            }
            // Captcha solutions from this endpoint are returned as a string seperated by a vertical bar. 
            // Eg. "263s2v|CAPCHA_NOT_READY|365312" and so on.
            const solutions = yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "get", ids: pendingIds.join(",") })).then((res) => res.request);
            solutions.split("|").forEach((state, index) => {
                const id = pendingIds[index];
                const captcha = this._pending[id];
                switch (state) {
                    case "CAPCHA_NOT_READY":
                        // Do nothing.
                        break;
                    case "ERROR_CAPTCHA_UNSOLVABLE":
                        captcha.reject(new SolverError(state, this._locale));
                        delete this._pending[id];
                        break;
                    default:
                        captcha.resolve({
                            id: id,
                            data: state
                        });
                        delete this._pending[id];
                        break;
                }
                ;
            });
        });
    }
    /**
     * Registers a new captcha promise to the array of pending captchas, returning the promise
     * object that will be automatically resolved or rejected by the getSolutions() function.
     * @param captchaId The captcha ID to get the solution of.
     * @returns The resulting captcha promise.
     */
    registerPollEntry(captchaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const captchaPromiseObject = {
                captchaId: captchaId
            };
            captchaPromiseObject.promise = new Promise((resolve, reject) => {
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
            return captchaPromiseObject.promise;
        });
    }
    //////////////////////
    // SOLVING METHODDS //
    ////////////////////// 
    imageCaptcha(image, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = toBase64(image);
            const c = yield this.post(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "base64" }), JSON.stringify({ body: data }));
            return this.registerPollEntry(c.request);
        });
    }
    // An alias for ImageCaptcha
    textCaptcha(image, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.imageCaptcha(image, extra);
        });
    }
    recaptchaV2(googlekey, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "userrecaptcha", googlekey: googlekey, pageurl: pageurl }));
            return this.registerPollEntry(c.request);
        });
    }
    hcaptcha(sitekey, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "hcaptcha", pageurl: pageurl, sitekey: sitekey }));
            return this.registerPollEntry(c.request);
        });
    }
    geetest(gt, challenge, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "geetest", gt: gt, challenge: challenge, pageurl: pageurl }));
            return this.registerPollEntry(c.request);
        });
    }
    funCaptcha(publickey, pageurl, serviceurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "funcaptcha", publickey: publickey, pageurl: pageurl }), (serviceurl ? { surl: serviceurl } : {})));
            return this.registerPollEntry(c.request);
        });
    }
    rotateCaptcha(image, angle = 40, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = toBase64(image);
            const c = yield this.post(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "rotatecaptcha", angle: angle }), JSON.stringify({ body: data }));
            return this.registerPollEntry(c.request);
        });
    }
    keyCaptcha(sscUserId, sscSessionId, sscWebserverSign, sscWebserverSign2, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "keycaptcha", s_s_c_user_id: sscUserId, s_s_c_session_id: sscSessionId, s_s_c_web_server_sign: sscWebserverSign, s_s_c_web_server_sign2: sscWebserverSign2, pageurl: pageurl }));
            return this.registerPollEntry(c.request);
        });
    }
    recaptchaV3(sitekey, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "userrecaptcha", version: "v3", sitekey: sitekey, pageurl: pageurl }));
            return this.registerPollEntry(c.request);
        });
    }
    recaptchaEnterprise(sitekey, pageurl, extra = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.get(this.in, Object.assign(Object.assign(Object.assign({}, extra), this.defaults), { method: "userrecaptcha", version: "v3", enterprise: "1", sitekey: sitekey, pageurl: pageurl }));
            return this.registerPollEntry(c.request);
        });
    }
}
