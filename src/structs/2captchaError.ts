export class APIError extends Error {
    code: number
    constructor(public err: string) {
        super(err)
        this.name = this.constructor.name
        switch (err) {
            case "ERROR_CAPTCHA_UNSOLVABLE": {
                this.code = 1
                this.message = "The captcha was unable to be solved."
            }; break;
            case "ERROR_WRONG_USER_KEY": {
                this.code = 2
                this.message = "You've specified an invalid key, please make sure it is 32 characters long."
            }; break;
            case "ERROR_KEY_DOES_NOT_EXIST": {
                this.code = 3
                this.message = "The key you've provided does not exist."
            }; break;
            case "ERROR_BAD_DUPLICATES": {
                this.code = 4
                this.message = "The max number of attempts for this captcha has been reached. Please validate."
            }; break;
            case "REPORT_NOT_RECORDED": {
                this.code = 5
                this.message = "You have submitted an invalid report. Either you've submitted over 40% of recent captchas, or the captcha was solved over 15 minutes ago."
            }; break;
            case "ERROR_DUPLICATE_REPORT": {
                this.code = 6
                this.message = "You have already reported this captcha!"
            }; break;
            case "ERROR_IMAGE_TYPE_NOT_SUPPORTED": {
                this.code = 7
                this.message = "The image type is not supported. Please validate it's a valid image you're passing through."
            }; break;
            case "ERROR_ZERO_CAPTCHA_FILESIZE": {
                this.code = 8
                this.message = "The image has no size, and is not valid. Please verify it."
            }; break;
            default: {
                console.log(err)
                this.code = 0
                this.message = "An Unexpected Error has occured. Please submit an issue on GitHub detailing this event."
            };
        }
    }
}