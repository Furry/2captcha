export type GenericObject = { [key: string | number]: string | number | any[] | GenericObject };
export type CaptchaType = 
    "GridMethodCoordnates" |
    "reCaptchaEnterprise"  |
    "rotateCaptcha"        |
    "reCaptchav2"          |
    "reCaptchav3"          | 
    "textCaptcha"          |
    "funCaptcha"           |
    "keyCaptcha"           |
    "hCaptcha"             |
    "GeeTest"              |
    "tiktok"               |
    "capy";

export type AbsoluteFilePathString = string;
export type Base64String = string;

export interface CaptchaResult {
    data: string,
    id: string
}

export interface ImageCaptchaExtras extends GenericObject {

};