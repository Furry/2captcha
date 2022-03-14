/// <reference types="node" resolution-mode="require"/>
import { AbsoluteFilePathString, Base64String, CaptchaResult, ImageCaptchaExtras } from "../types.js";
import { Locale } from "../utils/locale.js";
export declare class Solver {
    private _token;
    private _locale;
    constructor(token: string, locale?: Locale);
    get token(): string;
    private get in();
    private get out();
    private get defaults();
    private get;
    private post;
    /**
     * Get the balance of the account.
     */
    balance(): Promise<number>;
    getPingbackDomains(): Promise<string[]>;
    addPingbackDomain(domain: string): Promise<void>;
    imageCaptcha(image: Base64String | AbsoluteFilePathString | Buffer, extras: ImageCaptchaExtras): Promise<CaptchaResult>;
}
//# sourceMappingURL=solver.d.ts.map