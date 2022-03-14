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
export class Solver {
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
    get(url, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url + toQueryString(query), {
                method: "GET",
                headers: {
                    "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            return response.json();
        });
    }
    post(url, query, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url + toQueryString(query), {
                method: "POST",
                headers: {
                    "User-Agent": "2captchaNode/4.0.0 - Node-Fetch (https://github.com/furry/2captcha)",
                },
                body: body ? body : ""
            });
            return response.json();
        });
    }
    /**
     * Get the balance of the account.
     */
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "getbalance" })).then(res => res.request);
        });
    }
    getPingbackDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(this.out, Object.assign(Object.assign({}, this.defaults), { action: "get_pingback" })).then(res => res.request ? res.request : []);
        });
    }
    //////////////////////
    // SOLVING METHODDS //
    ////////////////////// 
    imageCaptcha(image, extras) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = toBase64(image);
            return yield this.post(this.in, Object.assign(Object.assign(Object.assign({}, extras), this.defaults), { method: "base64" }), data);
        });
    }
}
