export class APIError extends Error {
    code: number
    constructor(public err: string) {
        super(err)
        this.name = this.constructor.name
        switch (err) {
            case "ERROR_CAPTCHA_UNSOLVABLE": {
                this.code = 1
                this.message = "Your captcha was unable to be solved after 3 attempts. You haven't been charged for this request."
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
            case "ERROR_ZERO_BALANCE": {
                this.code = 9
                this.message = "There aren't enough funds in this account to complete the captcha."
            }; break;
            case "ERROR_PAGEURL": {
                this.code = 10
                this.message = "pageurl paramter is missing in the request."
            }; break;
            case "ERROR_NO_SLOT_AVAILABLE": {
                this.code = 11
                this.message = "Captcha Queue exceeded maximum capacity. Please wait a few moments before continuing, or update your settings at https://2captcha.com/setting"
            }; break;
            case "ERROR_TOO_BIG_CAPTCHA_FILESIZE": {
                this.code = 12
                this.message = "The Image Filesize exceeds 100kb. Please check the image file."
            }; break;
            case "ERROR_WRONG_FILE_EXTENSION": {
                this.code = 13
                this.message = "Unsupported file extension. Accepted extensions: jpg, jpeg, gif, png."
            }; break;
            case "ERROR_UPLOAD": {
                this.code = 14
                this.message = "The Solve Request was malformed. Please make sure the image is valid. If it is, please open up a github issue detailing this event."
            }; break;
            case "ERROR_IP_NOT_ALLOWED": {
                this.code = 15
                this.message = "The request is sent from an IP that is not on the allowed list. Please configure it here https://2captcha.com/setting/iplist"
            }; break;
            case "IP_BANNED": {
                this.code = 16
                this.message = "This IP address is banned due to frequent attempts to access the server via incorrect auth keys. Please try again in 5 minutes."
            }; break;
            case "ERROR_BAD_TOKEN_OR_PAGEURL": {
                this.code = 17
                this.message = "Please insure the googlekey and pageurl are correct for this reCaptcha request."
            }; break;
            case "ERROR_GOOGLEKEY": {
                this.code = 18
                this.message = "Please insure the sitekey provided is correct, and try again."
            }; break;
            case "ERROR_WRONG_GOOGLEKEY": {
                this.code = 19
                this.message = "The 'googlekey' parameter is missing or of an invalid format. Please make sure it is a valid string."
            }; break;
            case "ERROR_CAPTCHAIMAGE_BLOCKED": {
                this.code = 20
                this.message = "You've sent an image that is marked in our database as unrecognizable. Usually that happens if the website where you found the captcha stopped sending you captchas and started to send 'deny access' image."
            }; break;
            case "TOO_MANY_BAD_IMAGES": {
                this.code = 21
                this.message = "You're sending too many unrecognizable images. Please make sure the images are valid and understandable."
            }; break;
            case "MAX_USER_TURN": {
                this.code = 22
                this.message = "You've made more then 60 requests to in.php within 3 seconds. Please slow down requests, and wait 10 seconds for this restriction to be lifted."
            }; break;
            case "ERROR_BAD_PARAMETERS": {
                this.code = 23
                this.message = "Some parameters are missing in this request. If you're using a pre-provided function, please open up an issue on the GitHub"
            }; break;
            case "ERROR_BAD_PROXY": {
                this.code = 24
                this.message = "The proxy provided did not work."
            }; break;
            case "ERROR_CAPTCHA_ID": {
                this.code = 250
                this.message = "One of the parameters is incorrect. If you are submitting GeeTest V4 captcha, then check that the \'captcha_id\' parameter is correct."
            }; break;

            // Start for Res.php errors
            case "CAPCHA_NOT_READY": {
                this.code = 25
                this.message = "The captcha is not solved yet. If you see this error, Please open up an issue on the GitHub"
            }; break;
            case "ERROR_WRONG_ID_FORMAT": {
                this.code = 26
                this.message = "You've provided a captcha ID in the wrong format. The ID can contain only numbers."
            }; break;
            case "ERROR_WRONG_CAPTCHA_ID": {
                this.code = 27
                this.message = "You've provided an incorrect captcha ID."
            }; break;
            case "ERROR_BAD_DUPLICATES": {
                this.code = 28
                this.message = "The number of attempts has been reached, but the minimum number of matches was not hit."
            }; break;
            case "ERROR_REPORT_NOT_RECORDED": {
                this.code = 29
                this.message = "You've submitted more then 40% reports, or are reporting a captcha older then 15 minutes. This report has been ignored."
            }; break;
            case "ERROR_DUPLICATE_REPORT": {
                this.code = 30
                this.message = "You've already reported this captcha. This report is ignored."
            }; break;
            case "ERROR_IP_ADDRES": {
                this.code = 31
                this.message = "The PingBack/CallBack IP did not match the source of this request."
            }; break;
            case "ERROR_TOKEN_EXPIRED": {
                this.code = 32
                this.message = "The 'challenge' value for the GeeTest Captcha has already expired."
            }; break;
            case "ERROR_EMPTY_ACTION": {
                this.code = 33
                this.message = "The ACtion parameter is missing. Please open an issue in the GitHub"
            }; break;
            case "ERROR_PROXY_CONNECTION_FAILED": {
                this.code = 34
                this.message = "The proxy server was unable to load the captcha. This Proxy has been marked as bad, and will recieve an 'ERROR_BAD_PROXY' in future use."
            }; break;
            // @Victor, I hate you. Debugging this took a minute or two, but those two minutes were *very* irritating.
            // It doesn't follow 2captcha's error codes, and it's not documented in the 'Error Handling' tab of your API docs! :P 
            case "https://2captcha.com/blog/google-search-recaptcha": {
                this.code = 35
                this.message = "This captcha appears to be a Google Service Captcha (A special captcha that Google uses to protect their websites). Please provide a 'data-s' attribute in the CaptchaExtras of this function. View https://2captcha.com/blog/google-search-recaptcha for more information."
            }; break;
            default: {
                console.log(err)
                this.code = 0
                this.message = "An Unexpected Error has occured. Please submit an issue on GitHub detailing this event."
            };
        }
    }
}