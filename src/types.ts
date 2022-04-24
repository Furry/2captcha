import { SolverError } from "./structs/error.js";

export interface PendingCaptchaStorage {
    captchaId: string;
    resolve: (value: CaptchaResult) => void;
    reject: (error: SolverError) => void;
    promise: Promise<CaptchaResult>;
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

export interface CaptchaResult {
    data: string,
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