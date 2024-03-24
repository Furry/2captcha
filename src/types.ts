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
    interval: any;
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

export interface PollResult {
    errorId: 0,
    status: string,
    solution?: GenericObject
}

export interface PollError {
    errorId: 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15,
    errorCode: string,
    errorDescription: string
}

export interface CreatedTaskResponse {
    errorId: 0,
    taskId: number
}

export interface Task {
    task: {
        "type": string;
        [key: string]: any;
    }
    languagePool?: LanguagePool;
}

export interface CaptchaResult<T> {
    errorId: 0,
    status: "ready",
    solution: T,
    cost: string,
    ip: string,
    createTime: number,
    endTime: number,
    solveCount: number
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

export interface RotateCaptchaExtras {
    /** One step rotation angel. */
    angle?: number,
    /** A comment shown to workers to help them solve the captcha. */
    comment?: string,
    /** An optional image with instructions that will be shown to the worker */
    imgInstructions?: Base64String
}

// This is for requiring either a comment or image instruction. //
export interface GCExtrasBase {
    rows?: number,
    columns: number
}
export interface GCImageInstruction extends GCExtrasBase {
    comment?: string,
    imgInstructions: Base64String
}
export interface GCTextInstruction extends GCExtrasBase {
    imgInstruction?: Base64String,
    comment: string
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

export interface CapyTaskExtras {
    userAgent: string
}

export interface KeyCaptcha {
    websiteURL: string,
    s_s_c_user_id: string,
    s_s_c_session_id: string,
    s_s_c_web_server_sign: string,
    s_s_c_web_server_sign2: string
}

export interface LeminTaskExtras {
    leminApiServerSubdomain: string,
    userAgent: string
}

export interface AmazonTaskExtras {
    challengeScript: string,
    captchaScript: string
}

export interface DataDomeExtras extends ProxiedCaptchaExtras {
    userAgent: string
}

export interface CoordinatesTaskExtras {
    /** A comment shown to the workers to assist in solving the captcha. */
    comment?: string
    /** An optional image with instructions that will be shown to the workers. */
    imgInstructions?: Base64String
}

/////////////////////////
// Specialized results //
export interface SingleTokenResult {
    token: string
}

export interface GeetestV4Result {
    captcha_id: string,
    lot_number: string,
    pass_token: string,
    gen_time: string,
    captcha_output: string
}

export interface GeetestResult {
    captcha_id: string,
    lot_number: string,
    pass_token: string,
    gen_time: string,
    captcha_output: string
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

export interface TurnstileResult {
    token: string,
    userAgent: string
}

export interface CapyTaskResult {
    captchakey: string,
    challengekey: string,
    answer: string,
    respKey: string
}

export interface LeminCaptchaResult {
    answer: string,
    challenge_id: string
}

export interface AmazonCaptchaResult {
    captcha_voucher: string,
    existing_token: string
}

export interface DataDomeCaptchaResult {
    cookie: string
}

export interface RotateCaptchaResult {
    rotate: number
}


export interface GridCaptchaResult {
    "click": number[]
}

type Coordinates = {x: number, y: number}[]
export interface CoordinateCaptchaResult {
    coordinates: Coordinates 
}
export interface DrawAroundResult {
    "canvas": Coordinates[]
}

export interface BoundingBoxResult {
    bounding_boxes: {
        "xMin": number,
        "xMax": number,
        "yMin": number,
        "yMax": number
    }[]
}

export interface RecaptchaResult {
    gRecaptchaResponse: string
    token: string
}