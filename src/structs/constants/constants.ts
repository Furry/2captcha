const twoCaptchaName = '2captcha'
const twoCaptchaIn = 'https://2captcha.com/in.php'
const twoCaptchaRes =  'https://2captcha.com/res.php'

const ruCaptchaName = 'ruCaptcha'
const ruCaptchaIn = 'https://rucaptcha.com/in.php'
const ruCaptchaRes =  'https://rucaptcha.com/res.php'

const softId = 100500

const supportedProviders = {
  twoCaptcha: {
    name: twoCaptchaName,
    in: twoCaptchaIn,
    res: twoCaptchaRes
  },
  ruCaptcha: {
    name: ruCaptchaName,
    in: ruCaptchaIn,
    res: ruCaptchaRes
  }
}

export { supportedProviders, softId }