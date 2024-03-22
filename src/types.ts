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

export interface ImageCaptchaExtras extends GenericObject {

}

export interface RecaptchaV2Extras extends GenericObject {

}

export interface HCaptchaExtras extends GenericObject {

}

export interface GeetestExtras extends GenericObject {

}

export interface FunCaptchaExtras extends GenericObject {

}

export interface RotateCaptchaExtras extends GenericObject {

}

export interface KeyCaptchaExtras extends GenericObject {

}

export interface RecaptchaV3Extras extends GenericObject {

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