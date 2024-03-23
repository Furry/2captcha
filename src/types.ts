import { SolverError } from "./structs/error.js";

export interface PendingCaptcha {
    startTime: number;
    polls: number;
    captchaId: string;
}

export interface PendingCaptchaStorage extends PendingCaptcha {
    resolve: (value: CaptchaResult<unknown>) => void;
    reject: (error: SolverError) => void;
    promise: Promise<CaptchaResult<unknown>>;
}

export type GenericObject = { [key: string | number]: string | number | any[] | GenericObject };
export type CaptchaType = 
    "GridMethodCoordnates" |
    "reCaptchaEnterprise"  | //
    "rotateCaptcha"        | //
    "imageCaptcha"         | //
    "reCaptchav2"          | //
    "reCaptchav3"          | //
    "textCaptcha"          | //
    "funCaptcha"           | // 
    "keyCaptcha"           | //
    "hCaptcha"             | // 
    "GeeTest"              | // 
    "tiktok"               |
    "capy";

export type AbsoluteFilePathString = string;
export type Base64String = string;

// See definitions at https://2captcha.com/2captcha-api#language
export type LanguagePool =
"en"|"ru"|"es"|"pt"|"uk"|"vi"|"fr"|"id"|"ar"|"ja"|"tr"|"de"|"zh"|"fil"|"pl"|"th"|"it"|"nl"|"sk"|"bg"|"ro"|"hu"|"ko"|"cs"|"az"|"fa"|"bn"|"el"|"lt"|"lv"|"sv"|"sr"|"hr"|"he"|"hi"|"nb"|"sl"|"da"|"uz"|"fi"|"ca"|"ka"|"ms"|"te"|"et"|"ml"|"be"|"kk"|"mr"|"ne"|"my"|"bs"|"hy"|"mk"| "pa"

export interface Task {
    task: {
        "type": string;
        [key: string]: any;
    }
    languagePool?: LanguagePool;
}

export interface CaptchaResult<T> {
    data: T,
    id: string
}

export interface CaptchaTypes {
    "GridMethodCoordnates": []
    "reCaptchaEnterprise":  []
    "rotateCaptcha":        []
    "imageCaptcha":         []
    "reCaptchav2":          []
    "reCaptchav3":          []
    "textCaptcha":          [ string ]
    "funCaptcha":           []
    "keyCaptcha":           []
    "hCaptcha":             []
    "GeeTest":              []
    "tiktok":               []
    "capy":                 []
}


// For use with the ImageCaptchaExtras //
export enum NumericType {
    NoPreference = 0,
    NumericOnly = 1,
    LettersOnly = 2, 
    NumbersORletters = 3,
    NumbersANDletters = 4
}

// Optional properties for Image Captchas //
export interface ImageCaptchaExtras {
    phrase?: boolean,
    case?: boolean,
    numeric?: NumericType,
    math?: boolean,
    minLength?: number,
    maxLength?: number,
    comment?: string,
    imgInstructions?: string
}

export type RecaptchaApiDomain = "google.com" | "recaptcha.net";
export interface RecaptchaV2Extras {
    recaptchaDataSValue?: string,
    isInvisible?: boolean,
    userAgent?: string,
    cookies?: string,
    apiDomain?: RecaptchaApiDomain
}

export interface RecaptchaV3Extras {
    minScore: 0.3 | 0.7 | 0.9,
    isEnterprise: boolean,
    pageAction?: string,
    apiDomain?: RecaptchaApiDomain
}

export interface HCaptchaExtras {
    isInvisible: boolean,
    enterprisePayload: GenericObject,
}

export interface ProxiedCaptchaExtras {
    proxyType: "http" | "https" | "socks4" | "socks5",
    proxyAddress: string,
    proxyPort: number,
    proxyLogin?: string,
    proxyPassword?: string
}


export interface TurnstileExtras {
    cloudflare?: {
        action: string,
        data: string,
        pagedata: string
    }
}

export interface GeetestExtrasV4 {
    version: 4
    initParameters?: {
        captcha_id: string
    }
}

export interface GeetestExtrasV3 {
    geetestApiServerSubdomain: string,
    useragent: string,
    version: 3
}


export interface TurnstileDefault {
    userAgent?: string,
}

export interface CloudflareTurnstile {
    action: string,
    data: string,
    pagedata: string
}

// Specialized results //
export interface GeetestV4Result {
    captcha_id: string,
    lot_number: string,
    pass_token: string,
    gen_time: string,
    captcha_output: string
}

export interface GeetestResult {
    geetest_challenge: string,
    geetest_validate: string,
    geetest_seccode: string
}

export interface HCaptchaResult {
    token: string,
    respKey: string,
    useragent: string
}

export interface RecaptchaV3Result {
    gRecaptchaResponse: string,
    token: string
}