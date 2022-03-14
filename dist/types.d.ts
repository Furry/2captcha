export declare type GenericObject = {
    [key: string | number]: string | number | any[] | GenericObject;
};
export declare type CaptchaType = "GridMethodCoordnates" | "reCaptchaEnterprise" | "rotateCaptcha" | "reCaptchav2" | "reCaptchav3" | "textCaptcha" | "funCaptcha" | "keyCaptcha" | "hCaptcha" | "GeeTest" | "tiktok" | "capy";
export declare type AbsoluteFilePathString = string;
export declare type Base64String = string;
export interface CaptchaResult {
    data: string;
    id: string;
}
export interface ImageCaptchaExtras extends GenericObject {
}
//# sourceMappingURL=types.d.ts.map